#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { mkdirSync } from "node:fs";
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
const sitemap = readFlag("--sitemap", "https://mengtzu.com/sitemap.xml");
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
}, null, 2));
