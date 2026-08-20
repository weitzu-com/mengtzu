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
    title: locale === "zh" ? "孟子思想：性善、四端、仁政与浩然之气" : "Mencius philosophy: four core principles",
    description:
      locale === "zh"
        ? "这页把孟子思想拆成四个可独立引用的主题：性善、四端、仁政、浩然之气，并连接章句、问答、实践路径与原文证据。"
        : "A hub for Mencius philosophy through four independent pages on human nature, the four beginnings, humane government, and flood-like qi.",
  });
}

export default async function PrinciplesPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const title = locale === "zh" ? "孟子思想：四个核心主题页" : "Mencius philosophy: four core topic pages";
  const lead =
    locale === "zh"
      ? "如果只记住“性善”两个字，很难真正理解孟子。这页把孟子思想拆成四个独立主题：先给定义，再给第一性原理、实践路径、常见问题与原文入口。"
      : "Mencius cannot be reduced to a slogan about goodness. This hub breaks his philosophy into four independent topic pages with definitions, first principles, practice paths, common questions, and textual entry points.";

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
        <p className="eyebrow">{locale === "zh" ? "孟子思想" : "Mencius philosophy"}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </section>

      <section className="principle-grid page-grid">
        {principles.map((principle) => (
          <PrincipleCard key={principle.slug} locale={locale} principle={principle} />
        ))}
      </section>

      <section className="next-section">
        <h2>{locale === "zh" ? "先从性善进入，再把思想接回原文" : "Start with human nature, then return to the text"}</h2>
        <a className="primary-action" href={localPath(locale, "/principles/xing-shan")}>
          {locale === "zh" ? "阅读性善" : "Read human nature"}
        </a>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
