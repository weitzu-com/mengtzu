import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { SITE_PUBLISHED, getPathLastUpdated } from "../../lib/content-dates";
import { buildMetadata } from "../../lib/metadata";
import { absolutePath, isLocale, localPath, type Locale } from "../../lib/site";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildMenciusPersonSchema } from "../../lib/seo";
import { quoteEntries, quotesPageContent } from "../../lib/quotes";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const quoteThemeCards = {
  zh: [
    {
      title: "性善与四端",
      body: "适合回答“孟子怎样理解人性”“不忍人之心是什么意思”这类问题。",
      path: "/principles/xing-shan",
      cta: "查看性善主题页",
    },
    {
      title: "义与价值排序",
      body: "适合从“舍生取义”“何为大人”进入，处理价值高低和人格边界。",
      path: "/principles/hao-ran-zhi-qi",
      cta: "查看浩然之气主题页",
    },
    {
      title: "仁政与民本",
      body: "适合处理“民为贵”“政治正当性”“为何要先安顿百姓”这类搜索。",
      path: "/principles/ren-zheng",
      cta: "查看仁政主题页",
    },
    {
      title: "修身与反求诸己",
      body: "适合从“养心莫善于寡欲”“反求诸己”进入，再回到学习与读法路径。",
      path: "/method",
      cta: "查看读法页",
    },
  ],
  en: [
    {
      title: "Human nature and the four beginnings",
      body: "Best for searches asking what Mencius means by human nature or the heart that cannot bear suffering.",
      path: "/principles/xing-shan",
      cta: "Open human nature",
    },
    {
      title: "Righteousness and value order",
      body: "Best for readers entering through choosing righteousness over life or the shape of the great person.",
      path: "/principles/hao-ran-zhi-qi",
      cta: "Open flood-like qi",
    },
    {
      title: "Humane government and the people",
      body: "Best for searches around political legitimacy, the people, and why order must begin from settlement.",
      path: "/principles/ren-zheng",
      cta: "Open humane government",
    },
    {
      title: "Self-cultivation and turning inward",
      body: "Best for readers entering through few desires, self-examination, and the method of reading Mencius well.",
      path: "/method",
      cta: "Open the method page",
    },
  ],
} satisfies Record<Locale, { title: string; body: string; path: string; cta: string }[]>;

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
    socialImagePath: `/${locale}/quotes/opengraph-image`,
    socialImageAlt: locale === "zh" ? "孟子名言页分享图" : "Mencius quotes social card",
    socialImageWidth: 1200,
    socialImageHeight: 630,
  });
}

export default async function QuotesPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = quotesPageContent[locale];
  const themeCards = quoteThemeCards[locale];
  const updatedAt = getPathLastUpdated("/quotes");
  const personSchema = buildMenciusPersonSchema(locale);
  const breadcrumbItems = [
    { label: locale === "zh" ? "首页" : "Home", href: "" },
    { label: locale === "zh" ? "名言" : "Quotes", href: "/quotes" },
  ];

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
      datePublished: SITE_PUBLISHED,
      dateModified: updatedAt,
      about: personSchema,
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
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
      <Breadcrumbs locale={locale} items={breadcrumbItems} />

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
          <p className="eyebrow">{locale === "zh" ? "四类高意图搜索" : "Four high-intent routes"}</p>
          <h2>
            {locale === "zh"
              ? "别把名句当成孤立口号，先看它想带你进入哪类问题"
              : "Do not treat the quote as an isolated slogan; first ask what problem it is leading you into"}
          </h2>
        </div>
        <div className="article-grid">
          {themeCards.map((item) => (
            <div className="text-flow compact-flow" key={item.path}>
              <h2>
                <a className="text-link" href={localPath(locale, item.path)}>
                  {item.title}
                </a>
              </h2>
              <p>{item.body}</p>
              <a className="text-link" href={localPath(locale, item.path)}>
                {item.cta}
              </a>
            </div>
          ))}
        </div>
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

      <SiteFooter locale={locale} updatedAt={updatedAt} />
    </main>
  );
}
