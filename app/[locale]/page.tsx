import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "../components/JsonLd";
import { PrincipleCard } from "../components/PrincipleCard";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { buildMetadata } from "../lib/metadata";
import {
  LAST_UPDATED,
  SITE_URL,
  absolutePath,
  homeContent,
  isLocale,
  localPath,
  localeMeta,
  principles,
  type Locale,
} from "../lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

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
  });
}

export default async function LocaleHomePage({ params }: PageProps) {
  const locale = getLocaleOrNotFound((await params).locale);
  const content = homeContent[locale];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "mengtzu.com",
      url: SITE_URL,
      inLanguage: localeMeta[locale].htmlLang,
      description: localeMeta[locale].description,
      about: { "@id": `${SITE_URL}/#mencius` },
    },
    {
      "@context": "https://schema.org",
      "@id": `${SITE_URL}/#mencius`,
      "@type": "Person",
      name: locale === "zh" ? "孟子" : "Mencius",
      alternateName: ["Mengzi", "Mengtzu", "孟轲"],
      description:
        locale === "zh"
          ? "战国时期儒家思想家，主张性善、四端、仁政与浩然之气。"
          : "A Warring States Confucian thinker known for human nature is good, the four beginnings, humane government, and flood-like qi.",
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

      <section className="next-section">
        <div>
          <p className="eyebrow">{locale === "zh" ? "下一步" : "Next"}</p>
          <h2>
            {locale === "zh"
              ? "每个主题都有独立页面，可继续扩展原文、注释和文章。"
              : "Each topic has its own page, ready for passages, notes, and articles."}
          </h2>
        </div>
        <a className="primary-action" href={localPath(locale, "/principles")}>
          {locale === "zh" ? "进入主题索引" : "Open the topic index"}
        </a>
      </section>

      <SiteFooter locale={locale} />
      <meta itemProp="dateModified" content={LAST_UPDATED} />
    </main>
  );
}
