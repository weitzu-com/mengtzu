#!/usr/bin/env node

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const crawlTool = path.resolve(
  repoRoot,
  "../reports/2026-08-20_mengtzu.com_SEO完整审计/tools/crawl_audit.py",
);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function usage() {
  console.log(`Usage:
  npm run audit:live -- --label <commit-or-note> [--sitemap <url>] [--output <path>] [--workers <n>] [--dry-run]

Examples:
  npm run audit:live -- --label d548881-2026-08-20
  npm run audit:live -- --label after-deploy --output reports/evidence/live-crawl-post-after-deploy.json
`);
}

function percentile(values, fraction) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1));
  return Number(sorted[index].toFixed(1));
}

function summarizeResponseTimes(values) {
  if (!values.length) {
    return {
      count: 0,
      min: null,
      mean: null,
      p50: null,
      p75: null,
      p95: null,
      max: null,
    };
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return {
    count: values.length,
    min: Number(Math.min(...values).toFixed(1)),
    mean: Number((sum / values.length).toFixed(1)),
    p50: percentile(values, 0.5),
    p75: percentile(values, 0.75),
    p95: percentile(values, 0.95),
    max: Number(Math.max(...values).toFixed(1)),
  };
}

function stripLocalePrefix(pathname = "") {
  return pathname.replace(/^\/(?:zh|en)(?=\/|$)/, "") || "/";
}

function classifyRouteGroup(url) {
  const pathname = stripLocalePrefix(new URL(url).pathname);

  if (pathname === "/" || pathname === "") return "home";
  if (pathname === "/about") return "about";
  if (pathname === "/principles") return "principles_hub";
  if (/^\/principles\/[^/]+$/.test(pathname)) return "principle_page";
  if (pathname === "/books") return "books_hub";
  if (/^\/books\/[^/]+$/.test(pathname)) return "book_hub";
  if (/^\/books\/[^/]+\/[^/]+$/.test(pathname)) return "passage_page";
  if (pathname === "/quotes") return "quotes_hub";
  if (pathname === "/method") return "method";
  if (pathname === "/sources") return "sources";
  if (pathname === "/faq") return "faq";
  if (pathname === "/feed.xml") return "feed";
  if (pathname === "/rss.xml") return "legacy_feed";
  if (pathname === "/sitemap.xml") return "sitemap";
  if (pathname === "/robots.txt") return "robots";
  if (pathname === "/llms.txt") return "llms";
  return "other";
}

function countBy(values) {
  return values.reduce((counts, value) => {
    const key = value || "MISSING";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function buildCodexSummary(pages = []) {
  const routeGroupPages = new Map();

  for (const page of pages) {
    const group = classifyRouteGroup(page.url);
    const items = routeGroupPages.get(group) ?? [];
    items.push(page);
    routeGroupPages.set(group, items);
  }

  const route_group_counts = {};
  const route_group_response_ms = {};
  const x_vercel_cache_by_route_group = {};

  for (const [group, items] of [...routeGroupPages.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    route_group_counts[group] = items.length;
    route_group_response_ms[group] = summarizeResponseTimes(
      items
        .map((item) => item.elapsed_ms)
        .filter((value) => typeof value === "number" && Number.isFinite(value)),
    );
    x_vercel_cache_by_route_group[group] = countBy(items.map((item) => item.x_vercel_cache));
  }

  return {
    route_group_counts,
    route_group_response_ms,
    x_vercel_cache_counts: countBy(pages.map((page) => page.x_vercel_cache)),
    x_vercel_cache_by_route_group,
    cache_control_counts: countBy(pages.map((page) => page.cache_control)),
  };
}

const rawArgs = process.argv.slice(2);
if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
  usage();
  process.exit(0);
}

function readFlag(name, fallback = null) {
  const index = rawArgs.indexOf(name);
  if (index === -1) return fallback;
  return rawArgs[index + 1] ?? fallback;
}

const label = readFlag("--label");
const sitemap = readFlag("--sitemap", "https://www.mengtzu.com/sitemap.xml");
const output = readFlag(
  "--output",
  path.resolve(repoRoot, `reports/evidence/live-crawl-post-${label}.json`),
);
const workers = readFlag("--workers", "12");
const dryRun = rawArgs.includes("--dry-run");

if (!label) {
  usage();
  fail("Missing required --label argument.");
}

if (!existsSync(crawlTool)) {
  fail(`Crawl tool not found: ${crawlTool}`);
}

mkdirSync(path.dirname(output), { recursive: true });

const command = ["python3", crawlTool, "--sitemap", sitemap, "--output", output, "--workers", workers];

if (dryRun) {
  console.log(command.join(" "));
  process.exit(0);
}

const result = spawnSync(command[0], command.slice(1), {
  cwd: repoRoot,
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const payload = JSON.parse(readFileSync(output, "utf8"));
const summary = payload.summary ?? {};
const pages = payload.pages ?? [];
const codexSummary = buildCodexSummary(pages);
payload.codex_summary = codexSummary;
writeFileSync(output, JSON.stringify(payload, null, 2));

console.log("\nCrawl summary");
console.log(JSON.stringify({
  output,
  sitemap_url_count: summary.sitemap_url_count,
  status_counts: summary.status_counts,
  fetch_error_count: summary.fetch_error_count,
  missing_title: summary.missing_title?.length ?? 0,
  missing_description: summary.missing_description?.length ?? 0,
  missing_canonical: summary.missing_canonical?.length ?? 0,
  hreflang_incomplete: summary.hreflang_incomplete?.length ?? 0,
  missing_h1: summary.missing_h1?.length ?? 0,
  invalid_jsonld: summary.invalid_jsonld?.length ?? 0,
  broken_internal_links: summary.broken_internal_links?.length ?? 0,
  title_length_outliers: summary.title_length_outliers?.length ?? 0,
  description_length_outliers: summary.description_length_outliers?.length ?? 0,
  thin_content_candidates: summary.thin_content_candidates?.length ?? 0,
  response_time_ms: summary.response_time_ms,
  route_group_response_ms: codexSummary.route_group_response_ms,
  x_vercel_cache_counts: codexSummary.x_vercel_cache_counts,
}, null, 2));
