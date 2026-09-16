#!/usr/bin/env node
/**
 * Fast pre-build validation for content/articles/*.json.
 *
 * Checks that every article JSON is registered in content/articles/index.ts,
 * that SEO-critical fields stay within limits, that internal links resolve to
 * real routes, and that images marked "ready" exist on disk. Run before
 * `npm test` in the daily routine so schema mistakes fail in seconds instead
 * of after a full Next.js build.
 */

import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const BOOK_SLUGS = [
  "liang-hui-wang-i", "liang-hui-wang-ii", "gong-sun-chou-i", "gong-sun-chou-ii",
  "teng-wen-gong-i", "teng-wen-gong-ii", "li-lou-i", "li-lou-ii",
  "wan-zhang-i", "wan-zhang-ii", "gao-zi-i", "gao-zi-ii", "jin-xin-i", "jin-xin-ii",
];
const STATIC_PATHS = ["", "/principles", "/books", "/quotes", "/articles", "/method", "/about", "/sources", "/faq"];
const PRINCIPLE_SLUGS = ["xing-shan", "si-duan", "ren-zheng", "hao-ran-zhi-qi"];

async function knownPaths(articleSlugs) {
  const corpus = JSON.parse(await readFile(path.join(ROOT, "public", "data", "mencius.json"), "utf8"));
  const paths = new Set(STATIC_PATHS);
  for (const slug of PRINCIPLE_SLUGS) paths.add(`/principles/${slug}`);
  for (const slug of articleSlugs) paths.add(`/articles/${slug}`);
  corpus.chapters.forEach((chapter, index) => {
    paths.add(`/books/${BOOK_SLUGS[index]}`);
    for (const passage of chapter.passages) {
      const slug = passage.ref.replace(/^孟子\s*/u, "").toLowerCase().replace(".", "-");
      paths.add(`/books/${BOOK_SLUGS[index]}/${slug}`);
    }
  });
  return paths;
}

async function main() {
  const files = (await readdir(ARTICLES_DIR)).filter((file) => file.endsWith(".json"));
  const indexSource = await readFile(path.join(ARTICLES_DIR, "index.ts"), "utf8");
  const errors = [];
  const warnings = [];
  const articles = [];

  for (const file of files) {
    const article = JSON.parse(await readFile(path.join(ARTICLES_DIR, file), "utf8"));
    articles.push(article);
    if (article.slug !== file.replace(/\.json$/u, "")) errors.push(`${file}: slug "${article.slug}" does not match the file name`);
    if (!indexSource.includes(`./${file}`)) errors.push(`${file}: not imported in content/articles/index.ts`);
  }

  const paths = await knownPaths(articles.map((article) => article.slug));

  for (const article of articles) {
    const label = article.slug;
    const zh = article.zh ?? {};
    const en = article.en ?? {};

    if (!Array.isArray(article.keywords) || article.keywords.length < 3) errors.push(`${label}: keywords needs at least three entries`);
    if (!/^\d{4}-\d{2}-\d{2}T/u.test(article.publishedAt ?? "")) errors.push(`${label}: publishedAt must be an ISO timestamp`);
    if (!/^\d{4}-\d{2}-\d{2}T/u.test(article.updatedAt ?? "")) errors.push(`${label}: updatedAt must be an ISO timestamp`);
    if ((zh.description ?? "").length < 50) errors.push(`${label}: zh.description shorter than 50 characters`);
    if ((en.title ?? "").length > 60) errors.push(`${label}: en.title is ${en.title.length} characters (max 60)`);
    if ((en.description ?? "").length > 160) errors.push(`${label}: en.description is ${en.description.length} characters (max 160)`);
    if ((en.description ?? "").length < 80) warnings.push(`${label}: en.description shorter than 80 characters`);
    for (const locale of ["zh", "en"]) {
      const content = article[locale] ?? {};
      if (!Array.isArray(content.blocks) || content.blocks.length < 4) errors.push(`${label}: ${locale}.blocks needs at least four blocks`);
      if (!Array.isArray(content.faq) || content.faq.length < 2) errors.push(`${label}: ${locale}.faq needs at least two entries`);
      for (const link of content.relatedLinks ?? []) {
        if (!paths.has(link.path)) errors.push(`${label}: ${locale}.relatedLinks path "${link.path}" is not a known route`);
      }
      for (const block of content.blocks ?? []) {
        if (block.type === "quote" && block.href && !paths.has(block.href)) errors.push(`${label}: ${locale} quote href "${block.href}" is not a known route`);
        if (block.type === "image" && !article.images?.[block.image]) errors.push(`${label}: ${locale} references unknown image "${block.image}"`);
      }
      const imageBlocks = (content.blocks ?? []).filter((block) => block.type === "image").length;
      if (imageBlocks < 2) warnings.push(`${label}: ${locale} has only ${imageBlocks} image block(s); aim for at least two`);
    }

    if (!article.images?.[article.heroImage]) errors.push(`${label}: heroImage "${article.heroImage}" is not defined`);
    let pending = 0;
    for (const [key, image] of Object.entries(article.images ?? {})) {
      if (!image.prompt?.trim()) errors.push(`${label}: images.${key}.prompt is empty`);
      if (!image.alt?.zh || !image.alt?.en) errors.push(`${label}: images.${key}.alt needs zh and en`);
      if (image.status === "ready") {
        const file = path.join(ROOT, "public", image.src ?? "");
        if (!image.src || !existsSync(file)) errors.push(`${label}: images.${key} is ready but ${image.src ?? "(no src)"} does not exist`);
        if (!image.width || !image.height) errors.push(`${label}: images.${key} is ready but lacks width/height`);
        if (image.generatedBy && !/grok/i.test(image.generatedBy)) warnings.push(`${label}: images.${key} was generated by ${image.generatedBy}, not Grok`);
      } else {
        pending += 1;
      }
    }
    if (pending) warnings.push(`${label}: ${pending} image(s) still pending; run \`npm run images:grok -- --article ${label}\``);
  }

  for (const warning of warnings) console.warn(`warn  ${warning}`);
  for (const error of errors) console.error(`error ${error}`);
  console.log(`${articles.length} article(s) checked, ${errors.length} error(s), ${warnings.length} warning(s)`);
  if (errors.length) process.exit(1);
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
