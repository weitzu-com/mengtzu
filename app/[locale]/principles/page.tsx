import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { PrincipleCard } from "../../components/PrincipleCard";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { buildMetadata } from "../../lib/metadata";
import {
  SITE_URL,
  absolutePath,
  isLocale,
  localPath,
  principles,
  type Locale,
} from "../../lib/site";

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
    path: "/principles",
    title: locale === "zh" ? "孟子核心思想索引" : "Core principles of Mencius",
    description:
      locale === "zh"
        ? "以性善、四端、仁政、浩然之气四个主题建立孟子思想的独立页面索引，并连接对应章句、问答、实践路径、原文证据与主题网络。"
        : "An independent page index for human nature, the four beginnings, humane government, and flood-like qi.",
  });
}

export default async function PrinciplesPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const title = locale === "zh" ? "孟子核心思想索引" : "Core principles of Mencius";
  const lead =
    locale === "zh"
      ? "每个主题都是一个独立页面：先给定义，再给第一性原理、实践路径、常见问题和来源。"
      : "Each topic is an independent page with a definition, first principle, practice path, common questions, and source reference.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: absolutePath(locale, "/principles"),
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
    hasPart: principles.map((principle) => ({
      "@type": "Article",
      headline: principle[locale].title,
      url: absolutePath(locale, `/principles/${principle.slug}`),
      about: principle.keywords,
    })),
  };

  return (
    <main className="site-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="principles" path="/principles" />

      <section className="page-hero compact">
        <p className="eyebrow">{locale === "zh" ? "独立页面索引" : "Independent page index"}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </section>

      <section className="principle-grid page-grid">
        {principles.map((principle) => (
          <PrincipleCard key={principle.slug} locale={locale} principle={principle} />
        ))}
      </section>

      <section className="next-section">
        <h2>{locale === "zh" ? "先从性善读起" : "Start with human nature"}</h2>
        <a className="primary-action" href={localPath(locale, "/principles/xing-shan")}>
          {locale === "zh" ? "阅读性善" : "Read human nature"}
        </a>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
