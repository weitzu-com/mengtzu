import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { JsonLd } from "../../../components/JsonLd";
import { LocaleTwinLink } from "../../../components/LocaleTwinLink";
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
import { getPathLastUpdated } from "../../../lib/content-dates";
import { buildMetadata } from "../../../lib/metadata";
import { getPassageEditorialNote } from "../../../lib/passage-notes";
import { SITE_URL, absolutePath, isLocale, localPath, locales, type Locale } from "../../../lib/site";
import {
  PUBLISHER_SCHEMA,
  buildAuthorSchema,
  SITE_PUBLISHED,
  buildMenciusPersonSchema,
  buildBreadcrumbJsonLd,
  buildPassageTitle,
  getBookContext,
  getRelatedPrinciples,
} from "../../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const englishBookSeoTopics = [
  "profit, righteousness, and humane rule",
  "shared joy, war, and responsibility",
  "the four beginnings and human goodness",
  "flood-like qi and public duty",
  "livelihood, teaching, and institutions",
  "labor, teaching, and social order",
  "self-examination in disorder",
  "judging people and ritual",
  "ministerial duty and honest counsel",
  "learning, worth, and names",
  "human goodness and Gaozi",
  "nourishing the heart and character",
  "the heart, sincerity, and self-preservation",
  "words, destiny, and mature judgment",
] as const;

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

function trimText(text: string, maxLength: number, locale: Locale) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const primaryBoundary = locale === "zh" ? /[。！？；]/ : /[.!?;:]/;
  const boundaryIndex = normalized.slice(0, maxLength).search(primaryBoundary);
  if (boundaryIndex !== -1) {
    return normalized.slice(0, boundaryIndex + 1);
  }

  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

function buildPassageOpening(passage: Passage, locale: Locale) {
  return locale === "zh"
    ? trimText(passage.simplifiedChinese, 52, locale)
    : trimText(passage.english, 180, locale);
}

export function generateStaticParams() {
  return locales.flatMap((locale) => bookSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const book = getBook(slug);
  if (!book) return {};
  const context = getBookContext(book.index, locale);
  const displayName = locale === "zh" ? book.simplifiedName : englishBookNames[book.index];
  const updatedAt = getPathLastUpdated(`/books/${slug}`);
  const title = locale === "zh"
    ? `《孟子·${book.simplifiedName}》：${context.topic}`
    : `${englishBookNames[book.index]}: ${englishBookSeoTopics[book.index]}`;

  return buildMetadata({
    locale,
    path: `/books/${slug}`,
    title,
    description:
      locale === "zh"
        ? `${context.summary} 本卷页负责章句导航、重点支点与稳定引用路径；完整原文、逐字拼音与双语对读进入单章页。`
        : trimText(
            `Guide to ${displayName} on ${context.topic}. Passage map, featured entry points, and stable links to full passage pages.`,
            158,
            locale,
          ),
    type: "article",
    socialImagePath: `/${locale}/books/${slug}/opengraph-image`,
    socialImageAlt: title,
    socialImageWidth: 1200,
    socialImageHeight: 630,
    publishedTime: SITE_PUBLISHED,
    modifiedTime: updatedAt,
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
  const context = getBookContext(book.index, locale);
  const relatedPrinciples = [
    ...new Map(
      book.passages.flatMap((passage) =>
        getRelatedPrinciples(locale, passage, book.index).map((item) => [item.slug, item] as const),
      ),
    ).values(),
  ];
  const featuredPassages = book.passages
    .map((passage) => {
      const note = getPassageEditorialNote(passage.ref, locale);
      if (!note) return null;

      return {
        ref: passage.ref,
        href: localPath(locale, `/books/${slug}/${passageSlug(passage.ref)}`),
        title: buildPassageTitle(locale, displayName, passage),
        directAnswer: note.directAnswer,
        whyItMatters: note.whyItMatters,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 6);
  const breadcrumbItems = [
    { label: zh ? "首页" : "Home", href: "" },
    { label: zh ? "孟子全文" : "Text", href: "/books" },
    { label: displayName, href: `/books/${slug}` },
  ];
  const updatedAt = getPathLastUpdated(`/books/${slug}`);
  const socialImage = absolutePath(locale, `/books/${slug}/opengraph-image`);
  const personSchema = buildMenciusPersonSchema(locale);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: displayName,
      description: context.summary,
      url: absolutePath(locale, `/books/${slug}`),
      mainEntityOfPage: absolutePath(locale, `/books/${slug}`),
      inLanguage: zh ? "zh-CN" : "en",
      image: [socialImage],
      datePublished: SITE_PUBLISHED,
      dateModified: updatedAt,
      author: buildAuthorSchema(locale),
      publisher: PUBLISHER_SCHEMA,
      about: personSchema,
      isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
      hasPart: book.passages.map((passage, index) => ({
        "@type": "CreativeWork",
        name: passage.ref,
        position: index + 1,
        url: absolutePath(locale, `/books/${slug}/${passageSlug(passage.ref)}`),
      })),
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
  ];

  return (
    <main className="site-shell book-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="books" path={`/books/${slug}`} />
      <Breadcrumbs locale={locale} items={breadcrumbItems} />

      <section className="page-hero compact">
        <p className="eyebrow">
          {zh
            ? `第 ${String(book.index + 1).padStart(2, "0")} 卷 · ${book.passages.length} 章`
            : `Part ${String(book.index + 1).padStart(2, "0")} · ${book.passages.length} passages`}
        </p>
        <h1>{displayName}</h1>
        <p>
          {zh
            ? "本卷页负责导航、问题骨架与稳定引用路径；完整原文、逐字拼音与双语对读进入单章页。"
            : "This part page carries the argument map and stable citation routes; full source text, pinyin, and close bilingual reading live on the passage pages."}
        </p>
      </section>

      <section className="definition-box">
        <h2>{zh ? "本卷在讨论什么" : "What this part is doing"}</h2>
        <p>{context.summary}</p>
      </section>

      {featuredPassages.length > 0 && (
        <section className="answer-section">
          <div className="section-heading">
            <p className="eyebrow">{zh ? "卷级支点" : "Book-level hubs"}</p>
            <h2>{zh ? "本卷重点章句支点" : "Featured annotated passages in this part"}</h2>
          </div>
          <div className="answer-list">
            {featuredPassages.map((item) => (
              <article key={item.href} className="answer-item">
                <p className="eyebrow">{item.ref}</p>
                <h3>
                  <a className="text-link" href={item.href}>
                    {item.title}
                  </a>
                </h3>
                <p>{item.directAnswer}</p>
                <p>{item.whyItMatters}</p>
              </article>
            ))}
          </div>
        </section>
      )}

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
          {book.passages.map((passage) => {
            const note = getPassageEditorialNote(passage.ref, locale);
            const passageHref = localPath(locale, `/books/${slug}/${passageSlug(passage.ref)}`);
            const title = buildPassageTitle(locale, displayName, passage);
            const sourceOpening = buildPassageOpening(passage, locale);

            return (
              <section key={passage.ref} id={passageSlug(passage.ref)} className="book-passage">
                <div className="book-ref">
                  <a href={passageHref}>
                    {passage.ref}
                    <small>{zh ? "进入单章全文" : "Open full passage"}</small>
                  </a>
                </div>
                <div className="book-passage-copy">
                  <h2>
                    <a className="text-link" href={passageHref}>
                      {title}
                    </a>
                  </h2>
                  {note && <p className="book-question">{note.readingQuestion}</p>}
                  <p className="book-opening">
                    <strong>{zh ? "原文开头：" : "Source opening: "}</strong>
                    {sourceOpening}
                  </p>
                </div>
              </section>
            );
          })}
        </article>
      </div>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{zh ? "继续阅读" : "Keep reading"}</p>
          <h2>
            {zh
              ? "从本卷回到主题、来源与另一语种"
              : "From this part, return to the theme, the sources, and the other language"}
          </h2>
        </div>
        <div className="related-link-list">
          {relatedPrinciples.map((principle) => (
            <a key={principle.slug} className="text-link" href={principle.href}>
              {principle.shortTitle}
            </a>
          ))}
          <a className="text-link" href={localPath(locale, "/sources")}>
            {zh ? "来源与版本说明" : "Sources and edition notes"}
          </a>
          <LocaleTwinLink locale={locale} path={`/books/${slug}`} />
        </div>
      </section>

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

      <SiteFooter locale={locale} updatedAt={updatedAt} />
    </main>
  );
}
