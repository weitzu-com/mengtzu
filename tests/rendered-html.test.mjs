import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
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
  const [packageJson, vercelJson, nextConfig, routeFile] = await Promise.all([
    read("package.json").then(JSON.parse),
    read("vercel.json").then(JSON.parse),
    read("next.config.ts"),
    read("app/route.ts"),
  ]);

  assert.equal(packageJson.scripts.build, "next build --webpack");
  assert.equal(packageJson.scripts.dev, "next dev --webpack");
  assert.equal(vercelJson.framework, "nextjs");
  assert.match(vercelJson.buildCommand, /next build --webpack/);
  assert.match(nextConfig, /has: \[\{ type: "host", value: "www\.mengtzu\.com" \}\]/);
  assert.match(nextConfig, /Content-Security-Policy/);
  assert.match(routeFile, /308/);
});

test("exposes independent SEO and GEO routes", async () => {
  const [site, sitemap, llms, principlePage, bookPage, passagePage, seoLib, buildScript, passageNotes] = await Promise.all([
    read("app/lib/site.ts"),
    read("app/sitemap.ts"),
    read("app/llms.txt/route.ts"),
    read("app/[locale]/principles/[slug]/page.tsx"),
    read("app/[locale]/books/[slug]/page.tsx"),
    read("app/[locale]/books/[slug]/[passage]/page.tsx"),
    read("app/lib/seo.ts"),
    read("scripts/build-mencius-data.mjs"),
    read("app/lib/passage-notes.ts"),
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
  assert.match(principlePage, /Related passage anchors|相关章句支点/);
  assert.match(principlePage, /Breadcrumbs/);
  assert.match(bookPage, /generateStaticParams/);
  assert.match(bookPage, /buildBreadcrumbJsonLd/);
  assert.match(passagePage, /Alignment confidence|对齐置信度/);
  assert.match(passagePage, /buildPassageTitle/);
  assert.match(passagePage, /A human-edited reading layer|人工补强的解释层/);
  assert.match(seoLib, /buildPassageInsight/);
  assert.match(buildScript, /data\/mengzi\.json/);
  assert.doesNotMatch(buildScript, /work\/source\/aligned/);
  const noteCount = (passageNotes.match(/^  "孟子 /gm) ?? []).length;
  assert.ok(noteCount >= 70);
  assert.match(passageNotes, /Mencius 6A\.6: why Mencius insists that human nature is good/);
  assert.match(passageNotes, /《孟子·公孙丑上》2A\.6：孺子将入于井与四端/);
});

test("generated passage pages keep unique titles and h1s", async () => {
  const locales = ["zh", "en"];
  const passageNotes = await read("app/lib/passage-notes.ts");
  const noteCount = (passageNotes.match(/^  "孟子 /gm) ?? []).length;

  for (const locale of locales) {
    const htmlFiles = (await walk(fileURLToPath(new URL(`../.next/server/app/${locale}/books`, import.meta.url))))
      .filter((file) => /[/\\]books[/\\][^/\\]+[/\\][^/\\]+\.html$/.test(file));

    assert.equal(htmlFiles.length, 260);

    const titleCounts = new Map();
    const h1Counts = new Map();
    let faqStructuredPages = 0;

    for (const file of htmlFiles) {
      const html = await readFile(file, "utf8");
      const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
      const h1 = html.match(/<h1>(.*?)<\/h1>/)?.[1] ?? "";

      titleCounts.set(title, (titleCounts.get(title) ?? 0) + 1);
      h1Counts.set(h1, (h1Counts.get(h1) ?? 0) + 1);
      if (/"@type":"FAQPage"/.test(html)) faqStructuredPages += 1;
    }

    const duplicateTitles = [...titleCounts.values()].filter((count) => count > 1);
    const duplicateH1s = [...h1Counts.values()].filter((count) => count > 1);

    assert.equal(duplicateTitles.length, 0);
    assert.equal(duplicateH1s.length, 0);
    assert.equal(faqStructuredPages, noteCount);

    const principleFiles = (await walk(fileURLToPath(new URL(`../.next/server/app/${locale}/principles`, import.meta.url))))
      .filter((file) => /[/\\]principles[/\\][^/\\]+\.html$/.test(file));
    assert.equal(principleFiles.length, 4);

    for (const file of principleFiles) {
      const html = await readFile(file, "utf8");
      assert.match(html, /"@type":"FAQPage"/);
      assert.match(html, /Related passage anchors|相关章句支点/);
      const relatedPassageLinks = html.match(new RegExp(`href="/${locale}/books/[^"]+"`, "g")) ?? [];
      assert.ok(relatedPassageLinks.length >= 6);
    }
  }
});
