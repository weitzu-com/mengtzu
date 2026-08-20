import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const englishTitleTailPattern = /\b(and|or|of|the|to|in|on|for|with|without|from|by|is|are|was|were|what|why|how|when|where|which|that)$/i;
const englishDescriptionOpenEndPattern = /\b(and|or|of|to|with|without|from|by|that|which|when|while|if|because|as|is|are|was|were|be|been|being|do|does|did|has|have|had|would|could|should|may|might|will|shall|must|the|a|an|this|these|those)\.$/i;
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
  ["en/books/li-lou-i/4a-5.html", "Mencius 4A.5: the kingdom is rooted in family and self"],
  ["en/books/li-lou-i/4a-6.html", "Mencius 4A.6: great families set the tone of rule"],
  ["en/books/li-lou-i/4a-14.html", "Mencius 4A.14: do not enrich an inhumane ruler"],
  ["en/books/li-lou-i/4a-3.html", "Mencius 4A.3: the realm stands or falls by benevolence"],
  ["en/books/li-lou-i/4a-27.html", "Mencius 4A.27: benevolence begins with serving parents"],
  ["en/books/li-lou-i/4a-12.html", "Mencius 4A.12: sincerity is Heaven's way and man's work"],
  ["en/books/gong-sun-chou-i/2a-9.html", "Mencius 2A.9: Bo Yi withdrew; Liu Xia Hui kept himself"],
  ["en/books/teng-wen-gong-i/3a-2.html", "Mencius 3A.2: mourn your parents with your own utmost care"],
  ["en/books/teng-wen-gong-ii/3b-1.html", "Mencius 3B.1: do not bend the Way for larger results"],
  ["en/books/li-lou-ii/4b-2.html", "Mencius 4B.2: kindness is not yet government"],
  ["en/books/li-lou-ii/4b-3.html", "Mencius 4B.3: ministers answer as rulers treat them"],
  ["en/books/li-lou-ii/4b-11.html", "Mencius 4B.11: the great person follows righteousness"],
  ["en/books/li-lou-ii/4b-20.html", "Mencius 4B.20: rulers who love good words keep learning"],
  ["en/books/li-lou-i/4a-21.html", "Mencius 4A.21: unexpected praise and blame for perfection"],
  ["en/books/li-lou-i/4a-22.html", "Mencius 4A.22: easy speech comes from no reproof"],
  ["en/books/jin-xin-i/7a-27.html", "Mencius 7A.27: damaged conditions can injure the heart"],
  ["en/books/jin-xin-i/7a-10.html", "Mencius 7A.10: heroes rouse themselves without king Wen"],
  ["en/books/jin-xin-i/7a-12.html", "Mencius 7A.12: rule for life, not by sacrificing lives"],
  ["en/books/jin-xin-i/7a-14.html", "Mencius 7A.14: good teaching wins the people's hearts"],
  ["en/books/jin-xin-i/7a-39.html", "Mencius 7A.39: shortened mourning still wrongs grief"],
  ["en/books/jin-xin-ii/7b-32.html", "Mencius 7B.32: weed your own field before others"],
  ["en/books/jin-xin-ii/7b-4.html", "Mencius 7B.4: skill in war is a great crime"],
  ["en/books/liang-hui-wang-ii/1b-4.html", "Mencius 1B.4: share the people's joy and grief"],
  ["en/books/gong-sun-chou-i/2a-4.html", "Mencius 2A.4: honor virtue and esteem scholars"],
  ["en/books/gong-sun-chou-ii/2b-9.html", "Mencius 2B.9: Yan's rebellion does not excuse Qi"],
  ["en/books/li-lou-ii/4b-7.html", "Mencius 4B.7: the capable should raise others"],
  ["en/books/wan-zhang-i/5a-9.html", "Mencius 5A.9: Bai Li Xi would not sell himself"],
  ["en/books/gao-zi-i/6a-6.html", "Mencius 6A.6: why Mencius says human nature is good"],
  ["en/books/jin-xin-ii/7b-17.html", "Mencius 7B.17: leaving Lu is not leaving Qi"],
  ["en/books/jin-xin-ii/7b-20.html", "Mencius 7B.20: the clear teach by their clarity"],
  ["en/books/jin-xin-ii/7b-31.html", "Mencius 7B.31: extend what people already cannot bear"],
]);

const curatedEnglishDescriptions = new Map([
  [
    "en/books/gong-sun-chou-i/2a-9.html",
    "Mencius sets Bo Yi beside Liu Xia Hui to show that integrity is not one posture only: one stays clean by distance, another by not losing himself in corruption.",
  ],
  [
    "en/books/li-lou-ii/4b-20.html",
    "By naming Yu, Tang, Wen, Wu, and the Duke of Zhou, Mencius shows that sound rule stays open to good counsel, worthy people, and continued correction.",
  ],
  [
    "en/books/jin-xin-i/7a-14.html",
    "Mencius distinguishes good government from good teaching: one secures order and resources, the other goes deeper by shaping the people's hearts.",
  ],
  [
    "en/books/gong-sun-chou-ii/2b-9.html",
    "Mencius refuses to excuse the king of Qi by appealing to old precedents: the real question is whether this decision itself met benevolence and wisdom.",
  ],
  [
    "en/books/li-lou-ii/4b-15.html",
    "Mencius says learning must return to the point: wide study and detailed discussion matter only if they come back to what is concise and essential.",
  ],
  [
    "en/books/li-lou-ii/4b-32.html",
    "Mencius says Yao and Shun were not another species. Sagehood matters because human beings can really fulfill possibilities already human.",
  ],
  [
    "en/books/gao-zi-i/6a-6.html",
    "Against neutral or mixed theories of human nature, Mencius returns to compassion, shame, respect, and discernment as capacities already present within us.",
  ],
  [
    "en/books/jin-xin-ii/7b-17.html",
    "Mencius contrasts Confucius's slow departure from Lu with his swift departure from Qi to show that obligation follows the thickness of relation.",
  ],
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
  const [site, sitemap, llms, homePage, localeLayout, principlePage, bookPage, passagePage, quotesPage, seoLib, buildScript, passageNotes] = await Promise.all([
    read("app/lib/site.ts"),
    read("app/sitemap.ts"),
    read("app/llms.txt/route.ts"),
    read("app/[locale]/page.tsx"),
    read("app/[locale]/layout.tsx"),
    read("app/[locale]/principles/[slug]/page.tsx"),
    read("app/[locale]/books/[slug]/page.tsx"),
    read("app/[locale]/books/[slug]/[passage]/page.tsx"),
    read("app/[locale]/quotes/page.tsx"),
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
  assert.match(llms, /About Mencius/);
  assert.match(llms, /孟子简介/);
  assert.match(llms, /Quotes/);
  assert.match(llms, /名言与出处/);
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
  assert.match(quotesPage, /CollectionPage/);
  assert.match(quotesPage, /buildFaqPageJsonLd/);
  assert.match(seoLib, /buildPassageInsight/);
  assert.match(buildScript, /data\/mengzi\.json/);
  assert.doesNotMatch(buildScript, /work\/source\/aligned/);
  const noteCount = (passageNotes.match(/^  "孟子 /gm) ?? []).length;
  assert.equal(noteCount, 260);
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
        assert.match(description, /^[("'“”‘’\[]*[A-Z0-9]/);
        assert.doesNotMatch(description, englishDescriptionOpenEndPattern);
        const curatedTitle = curatedEnglishTitles.get(relativeFile);
        if (curatedTitle) {
          assert.equal(title, curatedTitle);
        }
        const curatedDescription = curatedEnglishDescriptions.get(relativeFile);
        if (curatedDescription) {
          assert.equal(description, curatedDescription);
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

test("book hub pages stay compact enough for crawl efficiency", async () => {
  for (const locale of ["zh", "en"]) {
    const bookFiles = (await walk(fileURLToPath(new URL(`../.next/server/app/${locale}/books`, import.meta.url))))
      .filter((file) => /[/\\]books[/\\][^/\\]+\.html$/.test(file));

    let maxSize = 0;
    let maxFile = "";

    for (const file of bookFiles) {
      const fileStat = await stat(file);
      if (fileStat.size > maxSize) {
        maxSize = fileStat.size;
        maxFile = file;
      }

      const html = await readFile(file, "utf8");
      assert.match(html, /Source opening:|原文开头：/);
      assert.match(html, /Open full passage|进入单章全文/);
      if (locale === "en") {
        const description = decodeHtmlEntities(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
        assert.ok(description.length >= 80, `${file} has short en book description: ${description.length}`);
        assert.ok(description.length <= 160, `${file} has long en book description: ${description.length}`);
      }
    }

    assert.ok(maxSize <= 160000, `book hub page too large: ${maxSize} bytes in ${maxFile}`);
  }
});

test("hub pages render direct answers, stronger routes, and faq schema", async () => {
  const zhHome = await readFile(fileURLToPath(new URL("../.next/server/app/zh.html", import.meta.url)), "utf8");
  const zhAbout = await readFile(fileURLToPath(new URL("../.next/server/app/zh/about.html", import.meta.url)), "utf8");
  const enPrinciples = await readFile(fileURLToPath(new URL("../.next/server/app/en/principles.html", import.meta.url)), "utf8");
  const zhBooks = await readFile(fileURLToPath(new URL("../.next/server/app/zh/books.html", import.meta.url)), "utf8");
  const enQuotes = await readFile(fileURLToPath(new URL("../.next/server/app/en/quotes.html", import.meta.url)), "utf8");

  assert.match(zhHome, /二百六十章句已经互相连通/);
  assert.match(zhAbout, /把“孟子是谁、为什么重要、从哪里开始”一次说清楚/);
  assert.match(zhAbout, /"@type":"FAQPage"/);
  assert.match(enPrinciples, /Decide which question you are asking/);
  assert.match(enPrinciples, /"@type":"FAQPage"/);
  assert.match(zhBooks, /四个最适合第一次进入《孟子》的章句支点/);
  assert.match(zhBooks, /稳定引用入口/);
  assert.match(zhBooks, /"@type":"FAQPage"/);
  assert.match(enQuotes, /Four high-intent routes/);
  assert.match(enQuotes, /Do not treat the quote as an isolated slogan/);
  assert.match(zhHome, /\/zh\/opengraph-image/);
  assert.match(zhAbout, /\/zh\/about\/opengraph-image/);
  assert.match(enPrinciples, /\/en\/principles\/opengraph-image/);
  assert.match(zhBooks, /\/zh\/books\/opengraph-image/);
  assert.match(enQuotes, /\/en\/quotes\/opengraph-image/);
});

test("detail pages point metadata and schema to route-specific social cards", async () => {
  const enPrinciple = await readFile(fileURLToPath(new URL("../.next/server/app/en/principles/xing-shan.html", import.meta.url)), "utf8");
  const zhBook = await readFile(fileURLToPath(new URL("../.next/server/app/zh/books/gao-zi-i.html", import.meta.url)), "utf8");
  const enPassage = await readFile(fileURLToPath(new URL("../.next/server/app/en/books/gao-zi-i/6a-6.html", import.meta.url)), "utf8");

  assert.match(enPrinciple, /\/en\/principles\/xing-shan\/opengraph-image/);
  assert.match(enPrinciple, /"image":\["https:\/\/mengtzu\.com\/en\/principles\/xing-shan\/opengraph-image"\]/);
  assert.match(zhBook, /\/zh\/books\/gao-zi-i\/opengraph-image/);
  assert.match(zhBook, /"image":\["https:\/\/mengtzu\.com\/zh\/books\/gao-zi-i\/opengraph-image"\]/);
  assert.match(enPassage, /\/en\/books\/gao-zi-i\/6a-6\/opengraph-image/);
  assert.match(enPassage, /"image":\["https:\/\/mengtzu\.com\/en\/books\/gao-zi-i\/6a-6\/opengraph-image"\]/);
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

test("quotes hub pages expose structured quote-entry paths", async () => {
  for (const locale of ["zh", "en"]) {
    const html = await readFile(fileURLToPath(new URL(`../.next/server/app/${locale}/quotes.html`, import.meta.url)), "utf8");
    assert.match(html, /"@type":"CollectionPage"/);
    assert.match(html, /"@type":"FAQPage"/);
    const quoteSourceLinks = html.match(new RegExp(`href="/${locale}/books/[^"]+/[^"]+"`, "g")) ?? [];
    assert.ok(quoteSourceLinks.length >= 12);
  }
});

test("about and principles hubs align to high-intent search entry points", async () => {
  for (const locale of ["zh", "en"]) {
    const aboutHtml = await readFile(fileURLToPath(new URL(`../.next/server/app/${locale}/about.html`, import.meta.url)), "utf8");
    const principlesHtml = await readFile(fileURLToPath(new URL(`../.next/server/app/${locale}/principles.html`, import.meta.url)), "utf8");

    assert.match(aboutHtml, /"@type":"AboutPage"/);
    assert.match(principlesHtml, /"@type":"CollectionPage"/);

    if (locale === "zh") {
      assert.match(aboutHtml, /孟子简介|孟子是谁/);
      assert.match(principlesHtml, /孟子思想/);
    } else {
      assert.match(aboutHtml, /Who is Mencius/);
      assert.match(principlesHtml, /Mencius philosophy/);
    }

    assert.match(aboutHtml, new RegExp(`href="/${locale}/principles"`));
    assert.match(aboutHtml, new RegExp(`href="/${locale}/quotes"`));
    assert.match(aboutHtml, new RegExp(`href="/${locale}/books"`));
  }
});
