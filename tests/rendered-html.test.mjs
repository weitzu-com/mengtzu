import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("ships a complete bilingual Mencius corpus", async () => {
  const corpus = JSON.parse(await read("public/data/mencius.json"));
  assert.equal(corpus.chapters.length, 14);

  const passageCount = corpus.chapters.reduce((sum, chapter) => sum + chapter.passages.length, 0);
  assert.equal(passageCount, 260);

  const first = corpus.chapters[0].passages[0];
  assert.match(first.ref, /孟子 1A\.1/);
  assert.ok(first.simplifiedChinese.length > 20);
  assert.ok(first.pinyinTokens.length > 20);
  assert.ok(first.english.length > 20);
});

test("keeps Vercel as the primary deployment path", async () => {
  const [packageJson, vercelJson] = await Promise.all([
    read("package.json").then(JSON.parse),
    read("vercel.json").then(JSON.parse),
  ]);

  assert.equal(packageJson.scripts.build, "next build --webpack");
  assert.equal(packageJson.scripts.dev, "next dev --webpack");
  assert.equal(vercelJson.framework, "nextjs");
  assert.match(vercelJson.buildCommand, /next build --webpack/);
});

test("exposes independent SEO and GEO routes", async () => {
  const [site, sitemap, llms, principlePage, bookPage, passagePage] = await Promise.all([
    read("app/lib/site.ts"),
    read("app/sitemap.ts"),
    read("app/llms.txt/route.ts"),
    read("app/[locale]/principles/[slug]/page.tsx"),
    read("app/[locale]/books/[slug]/page.tsx"),
    read("app/[locale]/books/[slug]/[passage]/page.tsx"),
  ]);

  assert.match(site, /xing-shan/);
  assert.match(site, /si-duan/);
  assert.match(site, /ren-zheng/);
  assert.match(site, /hao-ran-zhi-qi/);
  assert.match(site, /textPath/);
  assert.match(sitemap, /passageSlug/);
  assert.match(sitemap, /alternateLanguages/);
  assert.match(llms, /Complete text/);
  assert.match(llms, /孟子全文/);
  assert.match(principlePage, /Textual evidence|原文入口/);
  assert.match(bookPage, /generateStaticParams/);
  assert.match(passagePage, /First-principles reading|第一性阅读/);
});
