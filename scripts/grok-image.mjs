#!/usr/bin/env node
/**
 * Generate article illustrations with xAI Grok Imagine and store them under
 * public/images/articles/<slug>/.
 *
 *   XAI_API_KEY      required
 *   XAI_IMAGE_MODEL  optional, default grok-imagine-image-2.0
 *
 *   node scripts/grok-image.mjs --article <slug>      # pending images of one article
 *   node scripts/grok-image.mjs --all                  # pending images of every article
 *   node scripts/grok-image.mjs --article <slug> --force --only hero
 *   node scripts/grok-image.mjs --article <slug> --dry-run
 *
 * Every entry in the article's `images` map carries the prompt, alt text, and
 * aspect ratio. The script writes the binary, measures it, and marks the entry
 * `status: "ready"` with the model name and timestamp so the page renders it.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public", "images", "articles");
const API_URL = "https://api.x.ai/v1/images/generations";
const DEFAULT_MODEL = "grok-imagine-image-2.0";
const MAX_ATTEMPTS = 3;

const STYLE_SUFFIX = [
  "Editorial illustration for a scholarly website about Mencius (孟子) and classical Chinese philosophy.",
  "Refined ink-wash and mineral-pigment aesthetic, warm rice-paper tones, restrained palette of jade green, cinnabar red, and ink black.",
  "Museum-quality composition, soft natural light, fine detail, no text, no watermark, no logos, no modern objects, no distorted anatomy.",
].join(" ");

function parseArgs(argv) {
  const args = { article: null, all: false, force: false, only: null, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--article") args.article = argv[++i];
    else if (arg === "--all") args.all = true;
    else if (arg === "--force") args.force = true;
    else if (arg === "--only") args.only = argv[++i];
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("usage: node scripts/grok-image.mjs (--article <slug> | --all) [--force] [--only <imageKey>] [--dry-run]");
      process.exit(0);
    }
  }
  if (!args.article && !args.all) {
    console.error("Pass --article <slug> or --all.");
    process.exit(2);
  }
  return args;
}

function sniffImage(buffer) {
  if (buffer.length > 24 && buffer.readUInt32BE(0) === 0x89504e47) {
    return { ext: "png", width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { ext: "jpg", height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
    return { ext: "jpg", width: null, height: null };
  }
  if (buffer.slice(8, 12).toString("ascii") === "WEBP") {
    return { ext: "webp", width: null, height: null };
  }
  return { ext: "bin", width: null, height: null };
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generate({ apiKey, model, prompt, aspectRatio }) {
  const body = {
    model,
    prompt: `${prompt.trim()} ${STYLE_SUFFIX}`,
    aspect_ratio: aspectRatio ?? "16:9",
    resolution: "2k",
    response_format: "b64_json",
    n: 1,
  };
  if (model === DEFAULT_MODEL) body.quality = "medium";

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const payload = await response.json();
      const item = payload.data?.[0];
      if (item?.b64_json) return { buffer: Buffer.from(item.b64_json, "base64"), revisedPrompt: item.revised_prompt ?? null };
      if (item?.url) {
        const download = await fetch(item.url);
        if (!download.ok) throw new Error(`Image download failed: ${download.status}`);
        return { buffer: Buffer.from(await download.arrayBuffer()), revisedPrompt: item.revised_prompt ?? null };
      }
      throw new Error(`Unexpected response shape: ${JSON.stringify(payload).slice(0, 300)}`);
    }
    const text = await response.text();
    lastError = new Error(`xAI API ${response.status}: ${text.slice(0, 400)}`);
    if (response.status === 429 || response.status >= 500) {
      await sleep(2000 * attempt ** 2);
      continue;
    }
    throw lastError;
  }
  throw lastError;
}

async function processArticle(file, args, apiKey, model) {
  const articlePath = path.join(ARTICLES_DIR, file);
  const article = JSON.parse(await readFile(articlePath, "utf8"));
  const entries = Object.entries(article.images ?? {}).filter(([key, image]) => {
    if (args.only && key !== args.only) return false;
    return args.force || image.status !== "ready";
  });
  if (!entries.length) {
    console.log(`${article.slug}: nothing to generate`);
    return;
  }

  const outDir = path.join(PUBLIC_IMAGES_DIR, article.slug);
  await mkdir(outDir, { recursive: true });

  for (const [key, image] of entries) {
    if (args.dryRun) {
      console.log(`[dry-run] ${article.slug}/${key} (${image.aspectRatio ?? "16:9"}) → ${image.prompt.slice(0, 90)}…`);
      continue;
    }
    console.log(`${article.slug}/${key}: requesting ${model} (${image.aspectRatio ?? "16:9"})`);
    const { buffer, revisedPrompt } = await generate({ apiKey, model, prompt: image.prompt, aspectRatio: image.aspectRatio });
    const info = sniffImage(buffer);
    const baseName = (image.file ?? key).replace(/\.[a-z0-9]+$/i, "");
    const fileName = `${baseName}.${info.ext}`;
    await writeFile(path.join(outDir, fileName), buffer);

    article.images[key] = {
      ...image,
      file: fileName,
      src: `/images/articles/${article.slug}/${fileName}`,
      width: info.width ?? image.width ?? null,
      height: info.height ?? image.height ?? null,
      status: "ready",
      generatedBy: model,
      generatedAt: new Date().toISOString(),
      ...(revisedPrompt ? { revisedPrompt } : {}),
    };
    await writeFile(articlePath, `${JSON.stringify(article, null, 2)}\n`);
    console.log(`  saved ${path.relative(ROOT, path.join(outDir, fileName))} (${info.width}×${info.height}, ${(buffer.length / 1024).toFixed(0)} KB)`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.XAI_API_KEY?.trim();
  const model = process.env.XAI_IMAGE_MODEL?.trim() || DEFAULT_MODEL;
  if (!apiKey && !args.dryRun) {
    console.error("XAI_API_KEY is not set. Add it as a Cloud Agent secret (or export it locally) and rerun.");
    process.exit(2);
  }
  if (!existsSync(ARTICLES_DIR)) {
    console.error(`No articles directory at ${ARTICLES_DIR}`);
    process.exit(2);
  }

  const files = (await readdir(ARTICLES_DIR)).filter((file) => file.endsWith(".json") && file !== "manifest.json");
  const selected = args.all ? files : files.filter((file) => file === `${args.article}.json`);
  if (!selected.length) {
    console.error(`Article not found: ${args.article}`);
    process.exit(2);
  }
  for (const file of selected) {
    await processArticle(file, args, apiKey, model);
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
