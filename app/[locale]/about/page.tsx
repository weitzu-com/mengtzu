import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { buildMetadata } from "../../lib/metadata";
import { SITE_URL, aboutContent, absolutePath, isLocale, type Locale } from "../../lib/site";

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
    path: "/about",
    title: aboutContent[locale].title,
    description: aboutContent[locale].description,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = aboutContent[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: content.title,
    description: content.description,
    url: absolutePath(locale, "/about"),
    isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
  };

  return (
    <main className="site-shell text-page">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="about" path="/about" />
      <section className="page-hero compact">
        <p className="eyebrow">{locale === "zh" ? "使命" : "Mission"}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </section>
      <section className="text-flow">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <section className="principle-grid page-grid">
        {content.rules.map((rule) => (
          <div className="small-card" key={rule}>
            {rule}
          </div>
        ))}
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
