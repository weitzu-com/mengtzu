import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { buildMetadata } from "../../lib/metadata";
import { absolutePath, isLocale, localPath, type Locale } from "../../lib/site";
import { buildFaqPageJsonLd } from "../../lib/seo";
import { quoteEntries, quotesPageContent } from "../../lib/quotes";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const content = quotesPageContent[locale];
  return buildMetadata({
    locale,
    path: "/quotes",
    title: content.title,
    description: content.description,
  });
}

export default async function QuotesPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = quotesPageContent[locale];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: content.title,
      description: content.description,
      url: absolutePath(locale, "/quotes"),
      isPartOf: {
        "@type": "WebSite",
        name: "mengtzu.com",
        url: "https://mengtzu.com",
      },
      about: {
        "@type": "Person",
        name: locale === "zh" ? "孟子" : "Mencius",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: content.title,
      itemListElement: quoteEntries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry[locale].title,
        url: absolutePath(locale, entry.sourcePath),
        description: entry[locale].explanation,
      })),
    },
    buildFaqPageJsonLd(
      absolutePath(locale, "/quotes"),
      content.title,
      content.faqs.map((item) => ({ question: item.question, answer: item.answer })),
    ),
  ];

  return (
    <main className="site-shell text-page">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="quotes" path="/quotes" />

      <section className="page-hero compact">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.h1}</h1>
        <p>{content.lead}</p>
      </section>

      <section className="metric-grid" aria-label={locale === "zh" ? "名言页结构" : "Quotes page structure"}>
        {content.metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{content.sectionEyebrow}</p>
          <h2>{content.sectionTitle}</h2>
        </div>
        <div className="article-grid">
          {quoteEntries.map((entry) => {
            const item = entry[locale];
            return (
              <div className="text-flow compact-flow" key={entry.ref}>
                <span className="book-ref">{item.theme} · {entry.ref}</span>
                <h2>{item.title}</h2>
                <blockquote>{item.quote}</blockquote>
                <p>{item.explanation}</p>
                <div className="related-link-list">
                  <a className="text-link" href={localPath(locale, entry.sourcePath)}>{item.sourceCta}</a>
                  <a className="text-link" href={localPath(locale, entry.relatedPath)}>{item.relatedCta}</a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="answer-section">
        <div className="section-heading">
          <p className="eyebrow">{locale === "zh" ? "如何引用" : "How to use it"}</p>
          <h2>{locale === "zh" ? "把名句重新放回出处、问题和思想结构" : "Put the quote back into its source, problem, and argument"}</h2>
        </div>
        <div className="answer-list">
          {content.faqs.map((item) => (
            <article className="answer-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="next-section">
        <div>
          <p className="eyebrow">{locale === "zh" ? "下一步" : "Next"}</p>
          <h2>{content.nextTitle}</h2>
        </div>
        <a className="primary-action" href={localPath(locale, "/books")}>
          {content.nextCta}
        </a>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
