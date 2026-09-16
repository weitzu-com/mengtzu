#!/usr/bin/env node
/**
 * Pull Google Search Console performance data for the last N days and turn it
 * into a keyword-opportunity brief for the daily SEO article routine.
 *
 * Two input modes:
 *
 *   1. API mode (default). Needs a Google service account that has been added
 *      as a user on the Search Console property:
 *        GSC_SERVICE_ACCOUNT_JSON = raw JSON | base64 JSON | path to a .json file
 *        GSC_SITE_URL             = sc-domain:mengtzu.com (default)
 *
 *   2. CSV mode. Reads the "Queries" / "Pages" CSV exports from the Search
 *      Console UI (English or Chinese headers) when API credentials are not
 *      available:
 *        node scripts/gsc-fetch.mjs --csv-dir path/to/export
 *
 * Output (all under reports/gsc/<end-date>/):
 *   raw-query.json, raw-page.json, raw-query-page.json, raw-date.json
 *   summary.json  - totals, buckets, candidate topics (machine readable)
 *   summary.md    - human readable brief used by the daily article prompt
 * plus reports/gsc/latest.json and reports/gsc/latest-summary.md copies.
 */

import { createSign } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_SITE_URL = "sc-domain:mengtzu.com";
const GSC_LAG_DAYS = 3;
const ROW_LIMIT = 25000;
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

const TOPIC_BUCKETS = [
  { id: "who-is-mencius", zh: "孟子是谁 / 人物", test: /是谁|简介|生平|孟轲|who is|mengzi|meng ke|mengtzu|biography|life of/i, hub: "/about" },
  { id: "philosophy", zh: "孟子思想 / 哲学", test: /思想|哲学|主张|理论|philosophy|ideas|thought|teachings/i, hub: "/principles" },
  { id: "human-nature", zh: "性善论", test: /性善|人性|本善|性恶|荀子|告子|human nature|nature is good|xunzi|gaozi/i, hub: "/principles/xing-shan" },
  { id: "four-beginnings", zh: "四端", test: /四端|恻隐|羞恶|辞让|是非|不忍|four beginnings|four sprouts|compassion|sprouts/i, hub: "/principles/si-duan" },
  { id: "humane-government", zh: "仁政 / 王道 / 民本", test: /仁政|王道|民为贵|民本|humane government|benevolent government|kingly way|people are/i, hub: "/principles/ren-zheng" },
  { id: "qi", zh: "浩然之气 / 修身", test: /浩然|养气|修身|寡欲|flood-like|qi|moral courage|cultivat/i, hub: "/principles/hao-ran-zhi-qi" },
  { id: "quotes", zh: "孟子名言", test: /名言|名句|语录|经典|句子|quote|saying|famous/i, hub: "/quotes" },
  { id: "full-text", zh: "孟子全文 / 原文 / 翻译", test: /全文|原文|译文|翻译|注释|拼音|full text|translation|legge|chinese text|pinyin|book/i, hub: "/books" },
  { id: "passage", zh: "具体章句", test: /\b[1-7][ab]\.?\d+\b|梁惠王|公孙丑|滕文公|离娄|万章|告子|尽心|鱼我所欲|舍生取义|得道多助|生于忧患|天时不如地利/i, hub: "/books" },
];

function parseArgs(argv) {
  const args = { days: 90, out: "reports/gsc", csvDir: null, end: null, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[++i];
    if (arg === "--days") args.days = Number(next());
    else if (arg === "--end") args.end = next();
    else if (arg === "--out") args.out = next();
    else if (arg === "--csv-dir") args.csvDir = next();
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("usage: node scripts/gsc-fetch.mjs [--days 90] [--end YYYY-MM-DD] [--csv-dir dir] [--out reports/gsc] [--dry-run]");
      process.exit(0);
    }
  }
  return args;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function dateRange({ days, end }) {
  const endDate = end ? new Date(`${end}T00:00:00Z`) : new Date(Date.now() - GSC_LAG_DAYS * 86400000);
  const startDate = new Date(endDate.getTime() - (days - 1) * 86400000);
  return { startDate: isoDate(startDate), endDate: isoDate(endDate) };
}

async function loadServiceAccount() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  if (raw.startsWith("{")) return JSON.parse(raw);
  if (existsSync(raw)) return JSON.parse(await readFile(raw, "utf8"));
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    throw new Error("GSC_SERVICE_ACCOUNT_JSON must be raw JSON, base64 JSON, or a path to a JSON file.");
  }
}

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(serviceAccount.private_key));
  const assertion = `${header}.${claims}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()).access_token;
}

async function queryAnalytics({ token, siteUrl, startDate, endDate, dimensions }) {
  const rows = [];
  let startRow = 0;
  while (true) {
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ startDate, endDate, dimensions, rowLimit: ROW_LIMIT, startRow, dataState: "final" }),
      },
    );
    if (!response.ok) {
      throw new Error(`Search Analytics query failed (${dimensions.join(",")}): ${response.status} ${await response.text()}`);
    }
    const payload = await response.json();
    const batch = payload.rows ?? [];
    rows.push(...batch.map((row) => ({
      keys: row.keys,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })));
    if (batch.length < ROW_LIMIT) break;
    startRow += ROW_LIMIT;
  }
  return rows;
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  const parseLine = (line) => {
    const cells = [];
    let cell = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') { cell += '"'; i += 1; } else quoted = !quoted;
      } else if (ch === "," && !quoted) {
        cells.push(cell); cell = "";
      } else cell += ch;
    }
    cells.push(cell);
    return cells;
  };
  const [header, ...body] = lines.map(parseLine);
  return body.map((cells) => Object.fromEntries(header.map((key, index) => [key.trim(), cells[index] ?? ""])));
}

function numberFrom(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/[%,\s]/g, "");
  const parsed = Number(cleaned);
  if (Number.isNaN(parsed)) return 0;
  return String(value).includes("%") ? parsed / 100 : parsed;
}

function pick(row, candidates) {
  for (const key of Object.keys(row)) {
    if (candidates.some((candidate) => key.toLowerCase().includes(candidate))) return row[key];
  }
  return undefined;
}

function csvRowsToAnalytics(rows, keyCandidates) {
  return rows.map((row) => ({
    keys: [pick(row, keyCandidates) ?? ""],
    clicks: numberFrom(pick(row, ["click", "点击次数"])),
    impressions: numberFrom(pick(row, ["impression", "展示"])),
    ctr: numberFrom(pick(row, ["ctr", "点击率"])),
    position: numberFrom(pick(row, ["position", "排名"])),
  })).filter((row) => row.keys[0]);
}

async function loadCsvExports(csvDir) {
  const files = await readdir(csvDir);
  const find = (patterns) => files.find((file) => patterns.some((pattern) => pattern.test(file)));
  const queriesFile = find([/quer/i, /查询/]);
  const pagesFile = find([/page/i, /网页/]);
  const datesFile = find([/date/i, /日期/]);
  if (!queriesFile) throw new Error(`No Queries CSV found in ${csvDir}`);

  const readRows = async (file) => (file ? parseCsv(await readFile(path.join(csvDir, file), "utf8")) : []);
  return {
    query: csvRowsToAnalytics(await readRows(queriesFile), ["quer", "查询"]),
    page: csvRowsToAnalytics(await readRows(pagesFile), ["page", "网页", "url"]),
    queryPage: [],
    date: csvRowsToAnalytics(await readRows(datesFile), ["date", "日期"]),
  };
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + (row[key] ?? 0), 0);
}

function weightedPosition(rows) {
  const impressions = sum(rows, "impressions");
  if (!impressions) return 0;
  return rows.reduce((total, row) => total + row.position * row.impressions, 0) / impressions;
}

function bucketFor(query) {
  return TOPIC_BUCKETS.find((bucket) => bucket.test.test(query)) ?? { id: "other", zh: "未分类", hub: null };
}

function pathOf(url) {
  try {
    return new URL(url).pathname.replace(/^\/(zh|en)(?=\/|$)/, "") || "/";
  } catch {
    return url;
  }
}

async function loadArticleCoverage() {
  const dir = path.join(ROOT, "content", "articles");
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir)).filter((file) => file.endsWith(".json") && file !== "manifest.json");
  const articles = [];
  for (const file of files) {
    const article = JSON.parse(await readFile(path.join(dir, file), "utf8"));
    articles.push({ slug: article.slug, keywords: (article.keywords ?? []).map((keyword) => keyword.toLowerCase()) });
  }
  return articles;
}

function coveredBy(query, articles) {
  const normalized = query.toLowerCase();
  return articles.find((article) => article.keywords.some((keyword) => normalized.includes(keyword) || keyword.includes(normalized)))?.slug ?? null;
}

function analyze({ query, page, queryPage, date }, articles, meta) {
  const totals = {
    clicks: sum(query, "clicks"),
    impressions: sum(query, "impressions"),
    ctr: sum(query, "impressions") ? sum(query, "clicks") / sum(query, "impressions") : 0,
    position: weightedPosition(query),
    queries: query.length,
    pages: page.length,
  };

  const queries = query.map((row) => {
    const term = row.keys[0];
    const landing = queryPage.filter((item) => item.keys[0] === term).sort((a, b) => b.impressions - a.impressions)[0];
    return {
      query: term,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      bucket: bucketFor(term).id,
      landingPath: landing ? pathOf(landing.keys[1]) : null,
      coveredByArticle: coveredBy(term, articles),
    };
  });

  const impressionsThreshold = Math.max(5, Math.floor(totals.impressions / Math.max(queries.length, 1) / 2));
  const strikingDistance = queries
    .filter((row) => row.position >= 4 && row.position <= 20 && row.impressions >= impressionsThreshold)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);
  const lowCtr = queries
    .filter((row) => row.impressions >= Math.max(20, impressionsThreshold * 2) && row.ctr < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);
  const passageLanding = queries
    .filter((row) => row.landingPath?.startsWith("/books/") && row.landingPath.split("/").length > 3)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);

  const bucketStats = TOPIC_BUCKETS.concat([{ id: "other", zh: "未分类", hub: null }]).map((bucket) => {
    const rows = queries.filter((row) => row.bucket === bucket.id);
    return {
      id: bucket.id,
      label: bucket.zh,
      hub: bucket.hub,
      queries: rows.length,
      clicks: sum(rows, "clicks"),
      impressions: sum(rows, "impressions"),
      position: weightedPosition(rows),
      topQueries: rows.sort((a, b) => b.impressions - a.impressions).slice(0, 8).map((row) => row.query),
    };
  }).filter((bucket) => bucket.queries > 0).sort((a, b) => b.impressions - a.impressions);

  const candidates = queries
    .filter((row) => !row.coveredByArticle && row.impressions >= impressionsThreshold)
    .map((row) => {
      const positionFactor = row.position <= 3 ? 0.3 : row.position <= 10 ? 1 : row.position <= 20 ? 1.4 : row.position <= 40 ? 1.1 : 0.6;
      const uncoveredIntent = row.landingPath?.startsWith("/books/") && row.landingPath.split("/").length > 3 ? 1.3 : 1;
      return { ...row, score: Math.round(row.impressions * (1 - row.ctr) * positionFactor * uncoveredIntent * 100) / 100 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  const topPages = page
    .map((row) => ({ path: pathOf(row.keys[0]), url: row.keys[0], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);

  const daily = date.map((row) => ({ date: row.keys[0], clicks: row.clicks, impressions: row.impressions })).sort((a, b) => a.date.localeCompare(b.date));
  const half = Math.floor(daily.length / 2);
  const trend = daily.length >= 14
    ? {
        firstHalfClicks: sum(daily.slice(0, half), "clicks"),
        secondHalfClicks: sum(daily.slice(half), "clicks"),
        firstHalfImpressions: sum(daily.slice(0, half), "impressions"),
        secondHalfImpressions: sum(daily.slice(half), "impressions"),
      }
    : null;

  return {
    meta,
    totals,
    trend,
    buckets: bucketStats,
    topQueriesByImpressions: [...queries].sort((a, b) => b.impressions - a.impressions).slice(0, 40),
    topQueriesByClicks: [...queries].sort((a, b) => b.clicks - a.clicks).slice(0, 25),
    strikingDistance,
    lowCtr,
    passageLanding,
    topPages,
    articleCandidates: candidates,
    coveredArticles: articles.map((article) => article.slug),
  };
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function table(rows, columns) {
  if (!rows.length) return "_none_\n";
  const header = `| ${columns.map((column) => column.label).join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${columns.map((column) => column.format(row)).join(" | ")} |`).join("\n");
  return `${header}\n${divider}\n${body}\n`;
}

const queryColumns = [
  { label: "Query", format: (row) => row.query },
  { label: "Clicks", format: (row) => row.clicks },
  { label: "Impr.", format: (row) => row.impressions },
  { label: "CTR", format: (row) => pct(row.ctr) },
  { label: "Pos.", format: (row) => row.position.toFixed(1) },
  { label: "Bucket", format: (row) => row.bucket },
  { label: "Landing", format: (row) => row.landingPath ?? "-" },
];

function renderMarkdown(summary) {
  const { meta, totals, trend, buckets } = summary;
  const lines = [
    `# GSC brief · ${meta.siteUrl} · ${meta.startDate} → ${meta.endDate}`,
    "",
    `Source: ${meta.source}. Generated ${meta.generatedAt}.`,
    "",
    "## Totals",
    "",
    `- Clicks: **${totals.clicks}**`,
    `- Impressions: **${totals.impressions}**`,
    `- CTR: **${pct(totals.ctr)}**`,
    `- Weighted position: **${totals.position.toFixed(1)}**`,
    `- Distinct queries: ${totals.queries} · pages with impressions: ${totals.pages}`,
  ];
  if (trend) {
    lines.push(
      `- Trend (first half → second half): clicks ${trend.firstHalfClicks} → ${trend.secondHalfClicks}, impressions ${trend.firstHalfImpressions} → ${trend.secondHalfImpressions}`,
    );
  }
  lines.push("", "## Topic buckets", "");
  lines.push(table(buckets, [
    { label: "Bucket", format: (row) => `${row.id} (${row.label})` },
    { label: "Queries", format: (row) => row.queries },
    { label: "Clicks", format: (row) => row.clicks },
    { label: "Impr.", format: (row) => row.impressions },
    { label: "Pos.", format: (row) => row.position.toFixed(1) },
    { label: "Hub", format: (row) => row.hub ?? "-" },
    { label: "Top queries", format: (row) => row.topQueries.join("; ") },
  ]));
  lines.push("## Article candidates (uncovered, scored)", "");
  lines.push(table(summary.articleCandidates, [...queryColumns, { label: "Score", format: (row) => row.score }]));
  lines.push("## Striking distance (position 4–20)", "", table(summary.strikingDistance, queryColumns));
  lines.push("## High impressions, low CTR (<2%)", "", table(summary.lowCtr, queryColumns));
  lines.push("## Queries landing on passage pages (wider intent than the page)", "", table(summary.passageLanding, queryColumns));
  lines.push("## Top queries by impressions", "", table(summary.topQueriesByImpressions, queryColumns));
  lines.push("## Top queries by clicks", "", table(summary.topQueriesByClicks, queryColumns));
  lines.push("## Top pages", "", table(summary.topPages, [
    { label: "Path", format: (row) => row.path },
    { label: "Clicks", format: (row) => row.clicks },
    { label: "Impr.", format: (row) => row.impressions },
    { label: "CTR", format: (row) => pct(row.ctr) },
    { label: "Pos.", format: (row) => row.position.toFixed(1) },
  ]));
  lines.push(`Articles already covering keywords: ${summary.coveredArticles.length ? summary.coveredArticles.join(", ") : "none yet"}`, "");
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { startDate, endDate } = dateRange(args);
  const siteUrl = process.env.GSC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const articles = await loadArticleCoverage();

  let data;
  let source;
  if (args.csvDir) {
    data = await loadCsvExports(path.resolve(ROOT, args.csvDir));
    source = `Search Console UI CSV export (${args.csvDir})`;
  } else {
    const serviceAccount = await loadServiceAccount();
    if (!serviceAccount) {
      console.error([
        "No Search Console credentials found.",
        "Set GSC_SERVICE_ACCOUNT_JSON (service account added to the Search Console property as a user),",
        "or pass --csv-dir <folder with Queries.csv / Pages.csv exported from the Search Console UI>.",
      ].join("\n"));
      process.exit(2);
    }
    if (args.dryRun) {
      console.log(`[dry-run] would query ${siteUrl} from ${startDate} to ${endDate} as ${serviceAccount.client_email}`);
      return;
    }
    const token = await getAccessToken(serviceAccount);
    const run = (dimensions) => queryAnalytics({ token, siteUrl, startDate, endDate, dimensions });
    const [query, page, queryPage, date] = await Promise.all([run(["query"]), run(["page"]), run(["query", "page"]), run(["date"])]);
    data = { query, page, queryPage, date };
    source = "Search Console API (searchanalytics.query, dataState=final)";
  }

  const meta = { siteUrl, startDate, endDate, days: args.days, source, generatedAt: new Date().toISOString() };
  const summary = analyze(data, articles, meta);
  const outDir = path.resolve(ROOT, args.out, endDate);
  await mkdir(outDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outDir, "raw-query.json"), JSON.stringify(data.query, null, 2)),
    writeFile(path.join(outDir, "raw-page.json"), JSON.stringify(data.page, null, 2)),
    writeFile(path.join(outDir, "raw-query-page.json"), JSON.stringify(data.queryPage, null, 2)),
    writeFile(path.join(outDir, "raw-date.json"), JSON.stringify(data.date, null, 2)),
    writeFile(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2)),
    writeFile(path.join(outDir, "summary.md"), renderMarkdown(summary)),
  ]);
  await Promise.all([
    writeFile(path.resolve(ROOT, args.out, "latest.json"), JSON.stringify(summary, null, 2)),
    writeFile(path.resolve(ROOT, args.out, "latest-summary.md"), renderMarkdown(summary)),
  ]);

  console.log(`GSC brief written to ${path.relative(ROOT, outDir)}/summary.md`);
  console.log(`clicks=${summary.totals.clicks} impressions=${summary.totals.impressions} ctr=${pct(summary.totals.ctr)} position=${summary.totals.position.toFixed(1)}`);
  if (summary.articleCandidates.length) {
    console.log("Top article candidates:");
    for (const candidate of summary.articleCandidates.slice(0, 5)) {
      console.log(`  - ${candidate.query} (impr ${candidate.impressions}, pos ${candidate.position.toFixed(1)}, score ${candidate.score})`);
    }
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
