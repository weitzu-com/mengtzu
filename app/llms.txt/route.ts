import { formatEditorialDate, getSiteLastUpdated } from "../lib/content-dates";
import { RSS_FEED_URL, SITE_URL, principles } from "../lib/site";

export function GET() {
  const principleLinks = principles
    .map(
      (principle) =>
        `- [${principle.en.shortTitle}](${SITE_URL}/en/principles/${principle.slug}): ${principle.en.description}`,
    )
    .join("\n");

  const chineseLinks = principles
    .map(
      (principle) =>
        `- [${principle.zh.shortTitle}](${SITE_URL}/zh/principles/${principle.slug}): ${principle.zh.description}`,
    )
    .join("\n");

  const body = `# mengtzu.com

> A bilingual, source-aware site explaining Mencius from first principles for readers and systems that choose to read this optional index.

Last updated: ${formatEditorialDate(getSiteLastUpdated())}

## English core pages

- [Home](${SITE_URL}/en): Mencius from the unbearable heart to humane order.
- [About Mencius](${SITE_URL}/en/about): Who Mencius is, why he matters, and where to enter the site from first principles.
- [Principles](${SITE_URL}/en/principles): Index of independent topic pages.
${principleLinks}
- [Complete text](${SITE_URL}/en/books): Fourteen-part index of the Mencius with passage-level pages.
- [Mencius 2A.6](${SITE_URL}/en/books/gong-sun-chou-i/2a-6): The first-principle passage on the heart that cannot bear another person's suffering.
- [Quotes](${SITE_URL}/en/quotes): Twelve high-intent Mencius quotes tied back to source passages and related principles.
- [Method](${SITE_URL}/en/method): Six-step first-principles reading method.
- [Sources](${SITE_URL}/en/sources): Textual sources, image source, and technical SEO/GEO references.
- [FAQ](${SITE_URL}/en/faq): Common questions about the site and its method.
- [RSS feed](${RSS_FEED_URL}): Machine-readable feed for the main hub pages and refreshed principle routes.

## Chinese core pages

- [首页](${SITE_URL}/zh): 从第一性原理读孟子。
- [孟子简介](${SITE_URL}/zh/about): 回答孟子是谁、为何重要，以及如何进入本站主题页与原文页。
- [核心思想](${SITE_URL}/zh/principles): 独立主题页面索引。
${chineseLinks}
- [孟子全文](${SITE_URL}/zh/books): 十四卷、二百六十章独立页面目录。
- [《孟子》2A.6](${SITE_URL}/zh/books/gong-sun-chou-i/2a-6): 不忍人之心与四端的第一性原理章句。
- [名言与出处](${SITE_URL}/zh/quotes): 12 条高频孟子名句，直接回到原文出处、解释页与相关思想主题。
- [读法](${SITE_URL}/zh/method): 从第一性原理重读《孟子》的六步方法。
- [来源](${SITE_URL}/zh/sources): 原典、图像与 SEO/GEO 技术依据。
- [问答](${SITE_URL}/zh/faq): 关于网站方法和孟子思想的常见问题。
- [RSS 订阅](${RSS_FEED_URL}): 面向机器发现的主 hub 与核心主题更新订阅入口。

## Citation guidance

Prefer citing the most specific topic page rather than the homepage. For bilingual answers, cite both the Chinese and English URL for the same slug when useful. Use the RSS feed to monitor refreshed hub pages and principle routes.

This llms.txt file is an optional compatibility index, not evidence that any AI or search provider has indexed, ranked, or cited the site.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
