import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../../components/JsonLd";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import {
  bookSlugs,
  corpus,
  englishBookNames,
  getBook,
  passageSlug,
  simplifiedBookNames,
  type Passage,
} from "../../../mencius-data";
import { buildMetadata } from "../../../lib/metadata";
import { SITE_URL, absolutePath, isLocale, localPath, locales, type Locale } from "../../../lib/site";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

function RubyLine({ passage, locale }: { passage: Passage; locale: Locale }) {
  const text = locale === "zh" ? passage.simplifiedChinese : passage.chinese;
  return (
    <p className="book-chinese">
      {Array.from(text).map((char, index) =>
        /[\u3400-\u9fff]/.test(char) ? (
          <ruby key={`${passage.ref}-${index}`}>
            {char}
            <rt>{passage.pinyinTokens[index]}</rt>
          </ruby>
        ) : (
          <span key={`${passage.ref}-${index}`}>{char}</span>
        ),
      )}
    </p>
  );
}

export function generateStaticParams() {
  return locales.flatMap((locale) => bookSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const book = getBook(slug);
  if (!book) return {};
  const title =
    locale === "zh"
      ? `《孟子·${book.simplifiedName}》全文`
      : `Mencius: ${englishBookNames[book.index]}`;

  return buildMetadata({
    locale,
    path: `/books/${slug}`,
    title,
    description:
      locale === "zh"
        ? `《孟子·${book.simplifiedName}》完整章句，简体中文与逐字拼音对照阅读。`
        : `Read ${englishBookNames[book.index]} with Chinese text, aligned pinyin, and English translation.`,
    type: "article",
  });
}

export default async function BookPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const zh = locale === "zh";
  const book = getBook(slug);
  if (!book) notFound();

  const previous = book.index > 0 ? bookSlugs[book.index - 1] : null;
  const next = book.index < bookSlugs.length - 1 ? bookSlugs[book.index + 1] : null;
  const displayName = zh ? book.simplifiedName : englishBookNames[book.index];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: displayName,
    url: absolutePath(locale, `/books/${slug}`),
    inLanguage: zh ? "zh-CN" : "en",
    isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
    hasPart: book.passages.map((passage, index) => ({
      "@type": "CreativeWork",
      name: passage.ref,
      position: index + 1,
      url: absolutePath(locale, `/books/${slug}/${passageSlug(passage.ref)}`),
    })),
  };

  return (
    <main className="site-shell book-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="books" path={`/books/${slug}`} />

      <section className="page-hero compact">
        <p className="eyebrow">
          {zh
            ? `第 ${String(book.index + 1).padStart(2, "0")} 卷 · ${book.passages.length} 章`
            : `Part ${String(book.index + 1).padStart(2, "0")} · ${book.passages.length} passages`}
        </p>
        <h1>{displayName}</h1>
        <p>
          {zh
            ? "先读其言，再辨其所据，最后检验其原则。每章都可进入独立引用页面。"
            : "Read the words, expose the premise, then test the principle. Each passage opens as an independent citation page."}
        </p>
      </section>

      <div className="book-layout">
        <aside className="book-index" aria-label={zh ? "十四卷目录" : "Fourteen-part index"}>
          {corpus.chapters.map((chapter, index) => (
            <a
              key={chapter.id}
              className={index === book.index ? "active" : ""}
              href={localPath(locale, `/books/${bookSlugs[index]}`)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {zh ? simplifiedBookNames[index] : englishBookNames[index]}
            </a>
          ))}
        </aside>

        <article className="book-main">
          {book.passages.map((passage) => (
            <section key={passage.ref} id={passageSlug(passage.ref)} className="book-passage">
              <div className="book-ref">
                <a href={localPath(locale, `/books/${slug}/${passageSlug(passage.ref)}`)}>
                  {passage.ref}
                  <small>{zh ? "单章阅读" : "Open passage"}</small>
                </a>
              </div>
              <div>
                <RubyLine passage={passage} locale={locale} />
                {!zh && <p className="book-english">{passage.english}</p>}
              </div>
            </section>
          ))}
        </article>
      </div>

      <nav className="book-pagination" aria-label={zh ? "卷次翻页" : "Book pagination"}>
        {previous ? (
          <a href={localPath(locale, `/books/${previous}`)}>
            ← {zh ? simplifiedBookNames[book.index - 1] : englishBookNames[book.index - 1]}
          </a>
        ) : (
          <span />
        )}
        <a href={localPath(locale, "/books")}>{zh ? "返回目录" : "Back to index"}</a>
        {next ? (
          <a href={localPath(locale, `/books/${next}`)}>
            {zh ? simplifiedBookNames[book.index + 1] : englishBookNames[book.index + 1]} →
          </a>
        ) : (
          <span />
        )}
      </nav>

      <SiteFooter locale={locale} />
    </main>
  );
}
