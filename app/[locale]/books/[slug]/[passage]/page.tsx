import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../../components/Breadcrumbs";
import { JsonLd } from "../../../../components/JsonLd";
import { SiteFooter } from "../../../../components/SiteFooter";
import { SiteHeader } from "../../../../components/SiteHeader";
import {
  bookSlugs,
  corpus,
  englishBookNames,
  getPassage,
  passageSlug,
  simplifiedBookNames,
  type Passage,
} from "../../../../mencius-data";
import { buildMetadata } from "../../../../lib/metadata";
import { getPassageEditorialNote } from "../../../../lib/passage-notes";
import { absolutePath, isLocale, localPath, locales, type Locale } from "../../../../lib/site";
import {
  AUTHOR_SCHEMA,
  PUBLISHER_SCHEMA,
  SITE_PUBLISHED,
  SOCIAL_IMAGE_URL,
    buildBreadcrumbJsonLd,
    buildFaqPageJsonLd,
    buildPassageDescription,
    buildPassageInsight,
    buildPassageTitle,
  formatPassagePosition,
  getBookContext,
  getRelatedPrinciples,
} from "../../../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string; passage: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

function RubyPassage({ passage, locale }: { passage: Passage; locale: Locale }) {
  const text = locale === "zh" ? passage.simplifiedChinese : passage.chinese;
  return (
    <p className="passage-focus-chinese">
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
  return locales.flatMap((locale) =>
    corpus.chapters.flatMap((book, index) =>
      book.passages.map((passage) => ({
        locale,
        slug: bookSlugs[index],
        passage: passageSlug(passage.ref),
      })),
    ),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug, passage: passageParam } = await params;
  const locale = getLocale(localeParam);
  const found = getPassage(slug, passageParam);
  if (!found) return {};

  const bookName = locale === "zh" ? simplifiedBookNames[found.book.index] : englishBookNames[found.book.index];
  const title = buildPassageTitle(locale, bookName, found.passage);
  const description = buildPassageDescription(
    locale,
    bookName,
    found.passage,
    found.book.index,
    found.index,
  );

  return buildMetadata({
    locale,
    path: `/books/${slug}/${passageParam}`,
    title,
    description,
    type: "article",
    absoluteTitle: locale === "en",
  });
}

export default async function PassagePage({ params }: PageProps) {
  const { locale: localeParam, slug, passage: passageParam } = await params;
  const locale = getLocale(localeParam);
  const zh = locale === "zh";
  const found = getPassage(slug, passageParam);
  if (!found) notFound();

  const { book, passage, index } = found;
  const previous = index > 0 ? book.passages[index - 1] : null;
  const next = index < book.passages.length - 1 ? book.passages[index + 1] : null;
  const bookName = zh ? simplifiedBookNames[book.index] : englishBookNames[book.index];
  const path = `/books/${slug}/${passageParam}`;
  const context = getBookContext(book.index, locale);
  const relatedPrinciples = getRelatedPrinciples(locale, passage, book.index);
  const editorialNote = getPassageEditorialNote(passage.ref, locale);
  const insight = buildPassageInsight(locale, bookName, passage, book.index, index, book.passages.length);
  const title = buildPassageTitle(locale, bookName, passage);
  const description = buildPassageDescription(locale, bookName, passage, book.index, index);
  const citationNote = editorialNote?.citationAngle ?? insight.citationNote;
  const breadcrumbItems = [
    { label: zh ? "首页" : "Home", href: "" },
    { label: zh ? "孟子全文" : "Text", href: "/books" },
    { label: bookName, href: `/books/${slug}` },
    { label: passage.ref, href: path },
  ];
  const editorialFaq = editorialNote
    ? buildFaqPageJsonLd(absolutePath(locale, path), title, [
        {
          question: editorialNote.readingQuestion,
          answer: editorialNote.directAnswer,
        },
        {
          question: zh ? "这章揭示了什么第一性原理？" : "What first principle does this passage expose?",
          answer: editorialNote.firstPrinciple,
        },
        {
          question: zh ? "为什么这一章重要？" : "Why does this passage matter?",
          answer: editorialNote.whyItMatters,
        },
      ])
    : null;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      url: absolutePath(locale, path),
      mainEntityOfPage: absolutePath(locale, path),
      image: [SOCIAL_IMAGE_URL],
      datePublished: SITE_PUBLISHED,
      dateModified: "2026-08-20",
      author: AUTHOR_SCHEMA,
      publisher: PUBLISHER_SCHEMA,
      isAccessibleForFree: true,
      inLanguage: zh ? "zh-CN" : "en",
      articleSection: bookName,
      about: [
        { "@type": "Person", name: zh ? "孟子" : "Mencius" },
        ...relatedPrinciples.map((principle) => ({ "@type": "Thing", name: principle.title })),
      ],
      isPartOf: {
        "@type": "CreativeWork",
        name: bookName,
        url: absolutePath(locale, `/books/${slug}`),
      },
      position: index + 1,
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
    ...(editorialFaq ? [editorialFaq] : []),
  ];

  return (
    <main className="site-shell article-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="books" path={path} />
      <Breadcrumbs locale={locale} items={breadcrumbItems} />

      <article className="passage-focus">
        <p className="eyebrow">
          <a href={localPath(locale, `/books/${slug}`)}>{bookName}</a> · {formatPassagePosition(locale, index, book.passages.length)} · {passage.ref}
        </p>
        <h1>{title}</h1>
        <p className="passage-summary">{description}</p>
        <RubyPassage passage={passage} locale={locale} />
        {!zh && <p className="passage-focus-english">{passage.english}</p>}
        {zh && (
          <section className="answer-item translation-reference">
            <h2>英文参考译文</h2>
            <p>{passage.english}</p>
          </section>
        )}

        {editorialNote && (
          <section className="answer-section passage-editorial">
            <div className="section-heading">
              <p className="eyebrow">{zh ? "重点修订页" : "Priority note"}</p>
              <h2>{zh ? "人工补强的解释层" : "A human-edited reading layer"}</h2>
            </div>
            <div className="answer-list">
              <article className="answer-item">
                <h2>{zh ? "核心问题" : "Central question"}</h2>
                <p>{editorialNote.readingQuestion}</p>
              </article>
              <article className="answer-item">
                <h2>{zh ? "直接回答" : "Direct answer"}</h2>
                <p>{editorialNote.directAnswer}</p>
              </article>
              <article className="answer-item">
                <h2>{zh ? "第一性原理" : "First principle"}</h2>
                <p>{editorialNote.firstPrinciple}</p>
              </article>
              <article className="answer-item">
                <h2>{zh ? "为什么重要" : "Why it matters"}</h2>
                <p>{editorialNote.whyItMatters}</p>
              </article>
              <article className="answer-item">
                <h2>{zh ? "延伸阅读" : "Further reading"}</h2>
                <div className="related-link-list">
                  {editorialNote.relatedLinks.map((item) => (
                    <a key={item.path} className="text-link" href={localPath(locale, item.path)}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </article>
            </div>
          </section>
        )}

        <section className="definition-box passage-principle">
          <h2>{zh ? "这章在做什么" : "What this passage is doing"}</h2>
          <p>{insight.summary}</p>
        </section>

        <section className="article-grid passage-grid">
          <div>
            <h2>{zh ? "全卷语境" : "Book context"}</h2>
            <p>{context.summary}</p>
          </div>
          <div>
            <h2>{zh ? "关联主题" : "Related principles"}</h2>
            <div className="text-flow compact-flow">
              {relatedPrinciples.map((principle) => (
                <p key={principle.slug}>
                  <a className="text-link" href={principle.href}>
                    {principle.title}
                  </a>
                </p>
              ))}
            </div>
          </div>
          <div>
            <h2>{zh ? "引用提示" : "Citation note"}</h2>
            <p>{citationNote}</p>
          </div>
          <div>
            <h2>{zh ? "章句资料" : "Passage profile"}</h2>
            <dl className="meta-list">
              <div>
                <dt>{zh ? "卷次" : "Book"}</dt>
                <dd>{bookName}</dd>
              </div>
              <div>
                <dt>{zh ? "定位" : "Location"}</dt>
                <dd>{passage.ref}</dd>
              </div>
              <div>
                <dt>{zh ? "顺序" : "Position"}</dt>
                <dd>{formatPassagePosition(locale, index, book.passages.length)}</dd>
              </div>
              <div>
                <dt>{zh ? "对齐置信度" : "Alignment confidence"}</dt>
                <dd>{Math.round((passage.confidence ?? 0) * 100)}%</dd>
              </div>
            </dl>
          </div>
        </section>

        <nav className="book-pagination" aria-label={zh ? "章句翻页" : "Passage pagination"}>
          {previous ? (
            <a href={localPath(locale, `/books/${slug}/${passageSlug(previous.ref)}`)}>← {previous.ref}</a>
          ) : (
            <span />
          )}
          <a href={localPath(locale, `/books/${slug}`)}>{zh ? "返回本卷" : "Back to this part"}</a>
          {next ? (
            <a href={localPath(locale, `/books/${slug}/${passageSlug(next.ref)}`)}>{next.ref} →</a>
          ) : (
            <span />
          )}
        </nav>
      </article>

      <SiteFooter locale={locale} />
    </main>
  );
}
