import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { bookSlugs, corpus, englishBookNames, simplifiedBookNames } from "../../mencius-data";
import { buildMetadata } from "../../lib/metadata";
import { SITE_URL, absolutePath, isLocale, localPath, type Locale } from "../../lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  return buildMetadata({
    locale,
    path: "/books",
    title: locale === "zh" ? "《孟子》十四卷全文目录" : "The Mencius: fourteen-part complete text",
    description:
      locale === "zh"
        ? "《孟子》十四卷、二百六十章独立页面目录，提供简体原文、逐字拼音和英文对照入口。"
        : "A complete index of the fourteen parts and 260 passages of the Mencius, with Chinese, pinyin, and English reading pages.",
  });
}

export default async function BooksPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const zh = locale === "zh";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: zh ? "《孟子》十四卷全文目录" : "The Mencius complete text index",
    url: absolutePath(locale, "/books"),
    inLanguage: zh ? "zh-CN" : "en",
    isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
    hasPart: corpus.chapters.map((chapter, index) => ({
      "@type": "CreativeWork",
      name: zh ? simplifiedBookNames[index] : englishBookNames[index],
      url: absolutePath(locale, `/books/${bookSlugs[index]}`),
      position: index + 1,
      hasPart: chapter.passages.length,
    })),
  };

  return (
    <main className="site-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="books" path="/books" />

      <section className="page-hero compact">
        <p className="eyebrow">{zh ? "七篇 · 上下十四卷 · 二百六十章" : "Seven books · Fourteen parts · 260 passages"}</p>
        <h1>{zh ? "《孟子》全文目录" : "The Mencius complete text"}</h1>
        <p>
          {zh
            ? "每一卷和每一章句都有独立页面，可作为解释、引用、搜索与 AI 检索的原典证据。"
            : "Every part and passage has its own page, so interpretation can point back to a stable textual source."}
        </p>
      </section>

      <section className="book-card-grid">
        {corpus.chapters.map((chapter, index) => (
          <a className="book-card" key={chapter.id} href={localPath(locale, `/books/${bookSlugs[index]}`)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{zh ? simplifiedBookNames[index] : englishBookNames[index]}</h2>
            <p>
              {chapter.passages.length} {zh ? "章" : "passages"} · {chapter.name}
            </p>
          </a>
        ))}
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
