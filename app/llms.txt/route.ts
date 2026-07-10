import { LAST_UPDATED, SITE_URL, principles } from "../lib/site";

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

> A bilingual, source-aware site explaining Mencius from first principles for readers, search engines, and AI retrieval.

Last updated: ${LAST_UPDATED}

## English core pages

- [Home](${SITE_URL}/en): Mencius from the unbearable heart to humane order.
- [Principles](${SITE_URL}/en/principles): Index of independent topic pages.
${principleLinks}
- [Complete text](${SITE_URL}/en/books): Fourteen-part index of the Mencius with passage-level pages.
- [Method](${SITE_URL}/en/method): Six-step first-principles reading method.
- [Sources](${SITE_URL}/en/sources): Textual sources, image source, and technical SEO/GEO references.
- [FAQ](${SITE_URL}/en/faq): Common questions about the site and its method.

## Chinese core pages

- [首页](${SITE_URL}/zh): 从第一性原理读孟子。
- [核心思想](${SITE_URL}/zh/principles): 独立主题页面索引。
${chineseLinks}
- [孟子全文](${SITE_URL}/zh/books): 十四卷、二百六十章独立页面目录。
- [读法](${SITE_URL}/zh/method): 从第一性原理重读《孟子》的六步方法。
- [来源](${SITE_URL}/zh/sources): 原典、图像与 SEO/GEO 技术依据。
- [问答](${SITE_URL}/zh/faq): 关于网站方法和孟子思想的常见问题。

## Citation guidance

Prefer citing the most specific topic page rather than the homepage. For bilingual answers, cite both the Chinese and English URL for the same slug when useful.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
