import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const englishTitleTailPattern = /\b(and|or|of|the|to|in|on|for|with|without|from|by|is|are|was|were|what|why|how|when|where|which|that)$/i;
const curatedEnglishTitles = new Map([
  ["en/books/jin-xin-i/7a-13.html", "Mencius 7A.13: kingly rule changes people without notice"],
  ["en/books/jin-xin-i/7a-42.html", "Mencius 7A.42: with the Way and without it"],
  ["en/books/jin-xin-i/7a-5.html", "Mencius 7A.5: following the path without knowing the Way"],
  ["en/books/gao-zi-i/6a-7.html", "Mencius 6A.7: good years, bad years, and human nature"],
  ["en/books/gao-zi-i/6a-13.html", "Mencius 6A.13: growing wood but neglecting the self"],
  ["en/books/gao-zi-i/6a-18.html", "Mencius 6A.18: one cup cannot save burning firewood"],
  ["en/books/gao-zi-i/6a-14.html", "Mencius 6A.14: nourish the greater part to become great"],
  ["en/books/gao-zi-i/6a-15.html", "Mencius 6A.15: the ruling heart makes the great person"],
  ["en/books/gao-zi-i/6a-17.html", "Mencius 6A.17: true honor is already within"],
  ["en/books/gao-zi-i/6a-2.html", "Mencius 6A.2: human nature is like water flowing downward"],
  ["en/books/wan-zhang-ii/5b-5.html", "Mencius 5B.5: office is for the Way, not merely poverty"],
  ["en/books/wan-zhang-ii/5b-9.html", "Mencius 5B.9: kin ministers may replace the ruler"],
  ["en/books/wan-zhang-ii/5b-7.html", "Mencius 5B.7: serving is right; seeking audience is not"],
  ["en/books/gao-zi-ii/6b-1.html", "Mencius 6B.1: ritual or food misses the root"],
  ["en/books/li-lou-ii/4b-26.html", "Mencius 4B.26: to speak of nature is to follow what is so"],
  ["en/books/li-lou-ii/4b-1.html", "Mencius 4B.1: earlier and later sages share one measure"],
  ["en/books/li-lou-ii/4b-24.html", "Mencius 4B.24: Yi bore blame for Pang Meng"],
  ["en/books/li-lou-i/4a-17.html", "Mencius 4A.17: the drowning sister-in-law and discretion"],
  ["en/books/li-lou-i/4a-9.html", "Mencius 4A.9: win the people before the kingdom"],
  ["en/books/li-lou-i/4a-14.html", "Mencius 4A.14: do not enrich an inhumane ruler"],
  ["en/books/li-lou-i/4a-3.html", "Mencius 4A.3: the realm stands or falls by benevolence"],
  ["en/books/li-lou-i/4a-12.html", "Mencius 4A.12: sincerity is Heaven's way and man's work"],
  ["en/books/teng-wen-gong-i/3a-2.html", "Mencius 3A.2: mourn your parents with your own utmost care"],
  ["en/books/jin-xin-i/7a-27.html", "Mencius 7A.27: damaged conditions can injure the heart"],
  ["en/books/jin-xin-i/7a-39.html", "Mencius 7A.39: shortened mourning still wrongs grief"],
  ["en/books/jin-xin-ii/7b-32.html", "Mencius 7B.32: weed your own field before others"],
  ["en/books/jin-xin-ii/7b-4.html", "Mencius 7B.4: skill in war is a great crime"],
  ["en/books/liang-hui-wang-ii/1b-4.html", "Mencius 1B.4: share the people's joy and grief"],
  ["en/books/gong-sun-chou-i/2a-4.html", "Mencius 2A.4: honor virtue and esteem scholars"],
]);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
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
  assert.match(nextConfig, /source: "\/"/);
  assert.match(nextConfig, /destination: "https:\/\/mengtzu\.com\/zh"/);
  assert.match(nextConfig, /has: \[\{ type: "host", value: "www\.mengtzu\.com" \}\]/);
  assert.match(nextConfig, /Content-Security-Policy/);
  assert.match(routeFile, /308/);
});

test("exposes independent SEO and GEO routes", async () => {
  const [site, sitemap, llms, homePage, localeLayout, principlePage, bookPage, passagePage, seoLib, buildScript, passageNotes] = await Promise.all([
    read("app/lib/site.ts"),
    read("app/sitemap.ts"),
    read("app/llms.txt/route.ts"),
    read("app/[locale]/page.tsx"),
    read("app/[locale]/layout.tsx"),
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
  assert.match(homePage, /"@type": "WebSite"/);
  assert.match(homePage, /"@type": "Organization"/);
  assert.match(homePage, /publishingPrinciples/);
  assert.match(localeLayout, /type="speculationrules"/);
  assert.match(localeLayout, /eagerness: "moderate"/);
  assert.match(principlePage, /Textual evidence|原文入口/);
  assert.match(principlePage, /Related passage anchors|相关章句支点/);
  assert.match(principlePage, /Breadcrumbs/);
  assert.match(bookPage, /generateStaticParams/);
  assert.match(bookPage, /Featured annotated passages in this part|本卷重点章句支点/);
  assert.match(bookPage, /Book-level hubs|卷级支点/);
  assert.match(bookPage, /buildBreadcrumbJsonLd/);
  assert.match(passagePage, /Alignment confidence|对齐置信度/);
  assert.match(passagePage, /buildPassageTitle/);
  assert.match(passagePage, /A human-edited reading layer|人工补强的解释层/);
  assert.match(seoLib, /buildPassageInsight/);
  assert.match(buildScript, /data\/mengzi\.json/);
  assert.doesNotMatch(buildScript, /work\/source\/aligned/);
  const noteCount = (passageNotes.match(/^  "孟子 /gm) ?? []).length;
  assert.ok(noteCount >= 160);
  assert.match(passageNotes, /Mencius 6A\.6: why Mencius insists that human nature is good/);
  assert.match(passageNotes, /《孟子·公孙丑上》2A\.6：孺子将入于井与四端/);
});

test("generated passage pages keep unique titles and h1s", async () => {
  const locales = ["zh", "en"];
  const passageNotes = await read("app/lib/passage-notes.ts");
  const noteCount = (passageNotes.match(/^  "孟子 /gm) ?? []).length;

  for (const locale of locales) {
    const homeHtml = await readFile(fileURLToPath(new URL(`../.next/server/app/${locale}.html`, import.meta.url)), "utf8");
    assert.match(homeHtml, /"@type":"WebSite"/);
    assert.match(homeHtml, /"@type":"Organization"/);
    assert.match(homeHtml, /publishingPrinciples/);
    assert.match(homeHtml, /<script type="speculationrules">/);

    const htmlFiles = (await walk(fileURLToPath(new URL(`../.next/server/app/${locale}/books`, import.meta.url))))
      .filter((file) => /[/\\]books[/\\][^/\\]+[/\\][^/\\]+\.html$/.test(file));

    assert.equal(htmlFiles.length, 260);

    const titleCounts = new Map();
    const h1Counts = new Map();
    let faqStructuredPages = 0;
    const longTitles = [];
    const longDescriptions = [];

    for (const file of htmlFiles) {
      const html = await readFile(file, "utf8");
      const title = decodeHtmlEntities(html.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
      const h1 = html.match(/<h1>(.*?)<\/h1>/)?.[1] ?? "";
      const description = decodeHtmlEntities(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
      const relativeFile = path.relative(fileURLToPath(new URL("../.next/server/app", import.meta.url)), file).replace(/\\/g, "/");

      titleCounts.set(title, (titleCounts.get(title) ?? 0) + 1);
      h1Counts.set(h1, (h1Counts.get(h1) ?? 0) + 1);
      if (/"@type":"FAQPage"/.test(html)) faqStructuredPages += 1;
      if (locale === "en" && title.length > 60) longTitles.push({ file, title });
      if (locale === "en" && description.length > 160) longDescriptions.push({ file, description });
      if (locale === "en") {
        assert.doesNotMatch(title, englishTitleTailPattern);
        const curatedTitle = curatedEnglishTitles.get(relativeFile);
        if (curatedTitle) {
          assert.equal(title, curatedTitle);
        }
      }
    }

    const duplicateTitles = [...titleCounts.values()].filter((count) => count > 1);
    const duplicateH1s = [...h1Counts.values()].filter((count) => count > 1);

    assert.equal(duplicateTitles.length, 0);
    assert.equal(duplicateH1s.length, 0);
    assert.equal(faqStructuredPages, noteCount);
    if (locale === "en") {
      assert.equal(longTitles.length, 0);
      assert.equal(longDescriptions.length, 0);
    }

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

    const featuredBookPages = ["liang-hui-wang-i", "gao-zi-i"];
    for (const slug of featuredBookPages) {
      const bookHtml = await readFile(
        fileURLToPath(new URL(`../.next/server/app/${locale}/books/${slug}.html`, import.meta.url)),
        "utf8",
      );
      assert.match(bookHtml, /Featured annotated passages in this part|本卷重点章句支点/);
      const featuredLinks = bookHtml.match(new RegExp(`href="/${locale}/books/${slug}/[^"]+"`, "g")) ?? [];
      assert.ok(featuredLinks.length >= 3);
    }
  }
});

test("generated html avoids double-localized links and underspecified Chinese descriptions", async () => {
  const htmlFiles = (await walk(fileURLToPath(new URL("../.next/server/app", import.meta.url))))
    .filter((file) => file.endsWith(".html"));

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");

    assert.doesNotMatch(html, /href="\/(?:zh|en)\/(?:zh|en)\//);

    if (/[/\\]\.next[/\\]server[/\\]app[/\\]zh(?:[/\\].*)?\.html$/.test(file)) {
      const description = decodeHtmlEntities(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
      assert.ok(description.length >= 50, `${file} has short zh description: ${description.length}`);
    }
  }
});
