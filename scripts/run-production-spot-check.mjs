#!/usr/bin/env node

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const USER_AGENT = "Codex SEO Spot Check/1.0";
const GOOGLE_VERIFICATION_NAME = "google-site-verification";
const BING_VERIFICATION_NAME = "msvalidate.01";
const RSS_DISCOVERY_TYPE = "application/rss+xml";
const GA_LOADER_PATTERN = /www\.googletagmanager\.com\/gtag\/js\?id=/i;
const GA_MEASUREMENT_ID_PATTERN = /G-[A-Z0-9]{6,}/i;

const defaultTargets = [
  { key: "home", path: "/", expect: "html" },
  { key: "robots", path: "/robots.txt", expect: "text" },
  { key: "sitemap", path: "/sitemap.xml", expect: "xml" },
  { key: "feed", path: "/feed.xml", expect: "xml" },
  { key: "en-about", path: "/en/about", expect: "html" },
  { key: "zh-about", path: "/zh/about", expect: "html" },
  { key: "en-principles", path: "/en/principles", expect: "html" },
  { key: "en-quotes", path: "/en/quotes", expect: "html" },
  { key: "en-books", path: "/en/books", expect: "html" },
  { key: "en-passage", path: "/en/books/gong-sun-chou-i/2a-6", expect: "html" },
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function usage() {
  console.log(`Usage:
  npm run audit:spot -- --label <commit-or-note> [--base-url <url>] [--output <path>] [--commit <sha>] [--scope <text>] [--date <YYYY-MM-DD>]

Examples:
  npm run audit:spot -- --label 1a3beee-2026-08-20
  npm run audit:spot -- --label after-deploy --base-url https://www.mengtzu.com
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

function decodeHtmlEntities(text = "") {
  return text
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractFirst(pattern, text) {
  const match = pattern.exec(text);
  return match?.[1] ? decodeHtmlEntities(match[1].trim()) : null;
}

function extractAll(pattern, text) {
  return [...text.matchAll(pattern)].map((match) => match[1]).filter(Boolean);
}

function hasMetaName(text, name) {
  return text.includes(`name="${name}"`) || text.includes(`name='${name}'`);
}

const scriptTextCache = new Map();

async function fetchScriptText(scriptUrl) {
  if (!scriptTextCache.has(scriptUrl)) {
    scriptTextCache.set(
      scriptUrl,
      fetch(scriptUrl, {
        headers: {
          "user-agent": USER_AGENT,
          accept: "application/javascript,text/javascript,*/*;q=0.8",
        },
      }).then((response) => (response.ok ? response.text() : "")),
    );
  }

  return scriptTextCache.get(scriptUrl);
}

async function detectGaScript(html, pageUrl) {
  const htmlMeasurementId = html.match(GA_MEASUREMENT_ID_PATTERN)?.[0] ?? null;
  if (GA_LOADER_PATTERN.test(html) && htmlMeasurementId) {
    return {
      has_ga_script: true,
      ga_measurement_id: htmlMeasurementId,
      ga_script_source: "html",
      ga_script_asset: null,
    };
  }

  const pageOrigin = new URL(pageUrl).origin;
  const scriptUrls = [
    ...new Set(
      extractAll(/<script[^>]+src=["']([^"']+)["']/gi, html)
        .map((source) => new URL(decodeHtmlEntities(source), pageUrl))
        .filter((scriptUrl) => scriptUrl.origin === pageOrigin && scriptUrl.pathname.endsWith(".js"))
        .map((scriptUrl) => scriptUrl.toString()),
    ),
  ];

  for (const scriptUrl of scriptUrls) {
    const scriptText = await fetchScriptText(scriptUrl);
    const measurementId = scriptText.match(GA_MEASUREMENT_ID_PATTERN)?.[0] ?? null;
    if (GA_LOADER_PATTERN.test(scriptText) && measurementId) {
      return {
        has_ga_script: true,
        ga_measurement_id: measurementId,
        ga_script_source: "referenced client bundle",
        ga_script_asset: scriptUrl,
      };
    }
  }

  return {
    has_ga_script: false,
    ga_measurement_id: null,
    ga_script_source: null,
    ga_script_asset: null,
  };
}

async function fetchWithRedirects(inputUrl, maxRedirects = 10) {
  let currentUrl = inputUrl;
  const redirectChain = [];

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
      },
    });

    const location = response.headers.get("location");
    redirectChain.push({
      url: currentUrl,
      status: response.status,
      location,
    });

    if (response.status >= 300 && response.status < 400 && location) {
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return { response, finalUrl: currentUrl, redirectChain };
  }

  fail(`Too many redirects while fetching ${inputUrl}`);
}

function summarizeChecks(checks) {
  const htmlChecks = checks.filter((item) => item.kind === "html");
  const otherChecks = checks.filter((item) => item.kind !== "html");

  return {
    target_count: checks.length,
    all_status_ok: checks.every((item) => item.ok),
    html_page_count: htmlChecks.length,
    html_pages_with_canonical: htmlChecks.filter((item) => Boolean(item.canonical)).length,
    html_pages_with_hreflang: htmlChecks.filter((item) => item.hreflang_count > 0).length,
    html_pages_with_rss_autodiscovery: htmlChecks.filter((item) => Boolean(item.rss_feed)).length,
    html_pages_with_date_modified: htmlChecks.filter((item) => item.has_date_modified).length,
    html_pages_with_same_as: htmlChecks.filter((item) => item.has_same_as).length,
    html_pages_with_google_verification: htmlChecks.filter((item) => item.has_google_verification).length,
    html_pages_with_bing_verification: htmlChecks.filter((item) => item.has_bing_verification).length,
    html_pages_with_ga_script: htmlChecks.filter((item) => item.has_ga_script).length,
    non_html_ok_count: otherChecks.filter((item) => item.ok).length,
  };
}

function getCurrentCommit() {
  return execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
}

const label = readFlag("--label");
const baseUrl = readFlag("--base-url", "https://www.mengtzu.com");
const commit = readFlag("--commit", getCurrentCommit());
const scope = readFlag("--scope", "post-deploy production SEO spot check");
const date = readFlag("--date", new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date()));
const output = readFlag(
  "--output",
  path.resolve(repoRoot, `reports/evidence/production-spot-check-${label}.json`),
);

if (!label) {
  usage();
  fail("Missing required --label argument.");
}

mkdirSync(path.dirname(output), { recursive: true });

const checks = [];

for (const target of defaultTargets) {
  const url = new URL(target.path, baseUrl).toString();
  const { response, finalUrl, redirectChain } = await fetchWithRedirects(url);
  const contentType = response.headers.get("content-type") || "";
  const xVercelCache = response.headers.get("x-vercel-cache");
  const text = await response.text();
  const ok = response.ok;

  if (target.expect === "html") {
    const gaDetection = await detectGaScript(text, finalUrl);
    checks.push({
      key: target.key,
      url,
      final_url: finalUrl,
      redirect_chain: redirectChain,
      status: response.status,
      ok,
      kind: "html",
      content_type: contentType,
      x_vercel_cache: xVercelCache,
      title: extractFirst(/<title>(.*?)<\/title>/is, text),
      canonical: extractFirst(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i, text),
      hreflang_count: (text.match(/hreflang=["'][^"']+["']/gi) ?? []).length,
      rss_feed: extractFirst(new RegExp(`<link[^>]+type=["']${escapeRegExp(RSS_DISCOVERY_TYPE)}["'][^>]+href=["']([^"']+)["']`, "i"), text),
      has_google_verification: hasMetaName(text, GOOGLE_VERIFICATION_NAME),
      has_bing_verification: hasMetaName(text, BING_VERIFICATION_NAME),
      ...gaDetection,
      has_date_modified: /"dateModified":"[^"]+"/.test(text),
      has_same_as: /"sameAs":\[/i.test(text),
      structured_data_types: extractAll(/"@type":"([^"]+)"/g, text),
      html_chars: text.length,
    });
    continue;
  }

  checks.push({
    key: target.key,
    url,
    final_url: finalUrl,
    redirect_chain: redirectChain,
    status: response.status,
    ok,
    kind: target.expect,
    content_type: contentType,
    x_vercel_cache: xVercelCache,
    body_preview: text.slice(0, 240),
  });
}

const summary = summarizeChecks(checks);
const verificationNote = [
  `Google verification meta on ${summary.html_pages_with_google_verification}/${summary.html_page_count}`,
  `Bing verification meta on ${summary.html_pages_with_bing_verification}/${summary.html_page_count}`,
  `GA loader in HTML or a referenced client bundle on ${summary.html_pages_with_ga_script}/${summary.html_page_count}`,
].join(", ");

const payload = {
  date,
  commit,
  scope,
  status: summary.all_status_ok ? "spot check completed" : "spot check completed with non-200 responses",
  checks,
  summary: `${summary.html_page_count} HTML pages and ${summary.non_html_ok_count} non-HTML routes were checked; ${verificationNote}.`,
  counts: summary,
};

writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`);

console.log(JSON.stringify({
  output,
  status: payload.status,
  counts: summary,
  summary: payload.summary,
}, null, 2));
