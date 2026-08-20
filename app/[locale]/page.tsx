import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "../components/JsonLd";
import { PrincipleCard } from "../components/PrincipleCard";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { SITE_PUBLISHED, getPathLastUpdated } from "../lib/content-dates";
import { buildMetadata } from "../lib/metadata";
import {
  SITE_URL,
  absolutePath,
  homeContent,
  isLocale,
  localPath,
  localeMeta,
  principles,
  type Locale,
} from "../lib/site";
import { buildMenciusPersonSchema } from "../lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const searchEntryCards = {
  zh: [
    {
      title: "孟子是谁",
      body: "如果你的问题是孟子是谁、为什么重要、应该从哪里开始读，就先进入孟子简介页。",
      path: "/about",
      cta: "进入孟子简介",
    },
    {
      title: "孟子思想",
      body: "如果你在找孟子思想主线，就从性善、四端、仁政和浩然之气四个主题入口进入。",
      path: "/principles",
      cta: "进入孟子思想",
    },
    {
      title: "孟子名言与出处",
      body: "如果你是从名句进入，就不要停在口号层，先回到名言页，再接回原文出处和相关主题。",
      path: "/quotes",
      cta: "进入名言页",
    },
    {
      title: "《孟子》全文与作品结构",
      body: "如果你要找《孟子》全文、作品结构或中文原文入口，就直接进入十四卷目录与二百六十章句页。",
      path: "/books",
      cta: "进入全文目录",
    },
  ],
  en: [
    {
      title: "Who is Mencius?",
      body: "Use the about page when the query is about who Mencius is, why he matters, and where to begin reading.",
      path: "/about",
      cta: "Open who is Mencius",
    },
    {
      title: "Mencius philosophy",
      body: "Use the philosophy hub for human nature is good, the four sprouts, kingly way, and flood-like qi.",
      path: "/principles",
      cta: "Open Mencius philosophy",
    },
    {
      title: "Mencius quotes and sayings",
      body: "Use the quotes hub when search starts from a famous line and needs the source passage, explanation, and related principle back.",
      path: "/quotes",
      cta: "Open Mencius quotes",
    },
    {
      title: "Mencius full text and works of Mencius",
      body: "Use the full-text hub for the Mencius book, the works of Mencius, and where to read Mencius in Chinese.",
      path: "/books",
      cta: "Open the full text",
    },
  ],
} satisfies Record<
  Locale,
  { title: string; body: string; path: string; cta: string }[]
>;

function getLocaleOrNotFound(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = getLocaleOrNotFound((await params).locale);
  return buildMetadata({
    locale,
    title: localeMeta[locale].title,
    description: localeMeta[locale].description,
    socialImagePath: `/${locale}/opengraph-image`,
    socialImageAlt: locale === "zh" ? "孟子首页分享图" : "Mencius homepage social card",
    socialImageWidth: 1200,
    socialImageHeight: 630,
  });
}

export default async function LocaleHomePage({ params }: PageProps) {
  const locale = getLocaleOrNotFound((await params).locale);
  const content = homeContent[locale];
  const queryRoutes = searchEntryCards[locale];
  const updatedAt = getPathLastUpdated("");
  const organizationId = `${SITE_URL}/#organization`;
  const personId = `${SITE_URL}/#mencius`;
  const personSchema = buildMenciusPersonSchema(locale);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "mengtzu.com",
      url: SITE_URL,
      inLanguage: localeMeta[locale].htmlLang,
      description: localeMeta[locale].description,
      about: { "@id": personId },
      publisher: { "@id": organizationId },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: localeMeta[locale].title,
      url: absolutePath(locale, ""),
      inLanguage: localeMeta[locale].htmlLang,
      description: localeMeta[locale].description,
      datePublished: SITE_PUBLISHED,
      dateModified: updatedAt,
      isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
      about: { "@id": personId },
      mainEntity: { "@id": personId },
    },
    {
      "@context": "https://schema.org",
      "@id": organizationId,
      "@type": "Organization",
      name: "mengtzu.com",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      description: localeMeta[locale].description,
      publishingPrinciples: absolutePath(locale, "/method"),
    },
    {
      "@context": "https://schema.org",
      "@id": personId,
      ...personSchema,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: locale === "zh" ? "孟子核心思想" : "Core principles of Mencius",
      itemListElement: principles.map((principle, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: principle[locale].title,
        url: absolutePath(locale, `/principles/${principle.slug}`),
      })),
    },
  ];

  return (
    <main className="site-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="home" />

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.h1}</h1>
          <p className="hero-lead">{content.lead}</p>
          <div className="action-row">
            <a className="primary-action" href={localPath(locale, "/principles")}>
              {content.primaryCta}
            </a>
            <a className="secondary-action" href={localPath(locale, "/sources")}>
              {content.secondaryCta}
            </a>
          </div>
        </div>
        <figure className="hero-portrait">
          <Image
            src="/images/mengzi-kano-sansetsu.jpg"
            alt={locale === "zh" ? "狩野山雪绘孟子像" : "Painting of Mengzi by Kano Sansetsu"}
            width={1030}
            height={1752}
            priority
            sizes="(max-width: 860px) 100vw, 400px"
          />
          <figcaption>
            {locale === "zh"
              ? "狩野山雪绘孟子像，Tokyo National Museum，CC BY 4.0 兼容授权。"
              : "Mengzi by Kano Sansetsu, Tokyo National Museum, CC BY 4.0-compatible."}
          </figcaption>
        </figure>
      </section>

      <section className="quote-band" aria-label={locale === "zh" ? "孟子引文" : "Mencius quote"}>
        <blockquote>{content.quote}</blockquote>
        <span>{content.quoteLabel}</span>
      </section>

      <section className="metric-grid" aria-label={locale === "zh" ? "站点结构" : "Site structure"}>
        {content.metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{locale === "zh" ? "核心思想" : "Core principles"}</p>
          <h2>{locale === "zh" ? "从四个主题建立孟子知识骨架" : "A four-part knowledge backbone"}</h2>
        </div>
        <div className="principle-grid">
          {principles.map((principle) => (
            <PrincipleCard key={principle.slug} locale={locale} principle={principle} />
          ))}
        </div>
      </section>

      <section className="answer-section">
        <div className="section-heading">
          <p className="eyebrow">SEO + GEO</p>
          <h2>{content.capsulesTitle}</h2>
        </div>
        <div className="answer-list">
          {content.capsules.map((capsule) => (
            <article key={capsule.question} className="answer-item">
              <h3>{capsule.question}</h3>
              <p>{capsule.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{locale === "zh" ? "高意图入口" : "High-intent routes"}</p>
          <h2>
            {locale === "zh"
              ? "先把查询词对准正确的权威页，再回到原典证据"
              : "Match the query to the right authority page before returning to the text"}
          </h2>
        </div>
        <div className="article-grid">
          {queryRoutes.map((item) => (
            <div className="text-flow compact-flow" key={item.path}>
              <h3>
                <a className="text-link" href={localPath(locale, item.path)}>
                  {item.title}
                </a>
              </h3>
              <p>{item.body}</p>
              <a className="text-link" href={localPath(locale, item.path)}>
                {item.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="next-section">
        <div>
          <p className="eyebrow">{locale === "zh" ? "下一步" : "Next"}</p>
          <h2>
            {locale === "zh"
              ? "四个主题、十二条名句与二百六十章句已经互相连通，可按问题、主题或出处双向进入。"
              : "The four principle hubs, twelve quote routes, and 260 passages now connect in both directions by question, theme, and citation."}
          </h2>
        </div>
        <a className="primary-action" href={localPath(locale, "/principles")}>
          {locale === "zh" ? "进入主题索引" : "Open the topic index"}
        </a>
      </section>

      <SiteFooter locale={locale} updatedAt={updatedAt} />
      <meta itemProp="dateModified" content={updatedAt} />
    </main>
  );
}
