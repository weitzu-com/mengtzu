import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { SITE_URL, absolutePath, isLocale, localPath, locales, type Locale } from "../../../../lib/site";

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
  const excerpt = (locale === "zh" ? found.passage.simplifiedChinese : found.passage.english).slice(0, 120);

  return buildMetadata({
    locale,
    path: `/books/${slug}/${passageParam}`,
    title: locale === "zh" ? `《孟子·${bookName}》${found.passage.ref}` : `Mencius ${found.passage.ref}: ${bookName}`,
    description: excerpt,
    type: "article",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: zh ? `《孟子·${bookName}》${passage.ref}` : `Mencius ${passage.ref}: ${bookName}`,
    description: zh ? passage.simplifiedChinese.slice(0, 160) : passage.english.slice(0, 160),
    url: absolutePath(locale, path),
    isAccessibleForFree: true,
    inLanguage: zh ? "zh-CN" : "en",
    isPartOf: {
      "@type": "CreativeWork",
      name: bookName,
      url: absolutePath(locale, `/books/${slug}`),
    },
    publisher: { "@type": "Organization", name: "mengtzu.com", url: SITE_URL },
    position: index + 1,
  };

  return (
    <main className="site-shell article-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="books" path={path} />

      <article className="passage-focus">
        <p className="eyebrow">
          <a href={localPath(locale, `/books/${slug}`)}>{bookName}</a> · {passage.ref}
        </p>
        <h1>{zh ? "章句" : "Passage"} {String(index + 1).padStart(2, "0")}</h1>
        <RubyPassage passage={passage} locale={locale} />
        {!zh && <p className="passage-focus-english">{passage.english}</p>}

        <section className="definition-box passage-principle">
          <h2>{zh ? "第一性阅读" : "First-principles reading"}</h2>
          <p>
            {zh
              ? "先确认原话与语境，再写出论证依赖的前提，最后检验这条原则成立的条件与边界。"
              : "Begin with the words and context, expose the premise beneath the argument, then test the conditions and limits of the principle."}
          </p>
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
