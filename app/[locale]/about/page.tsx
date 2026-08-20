import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { buildMetadata } from "../../lib/metadata";
import { SITE_URL, aboutContent, absolutePath, isLocale, localPath, type Locale } from "../../lib/site";

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
    about: {
      "@type": "Person",
      name: locale === "zh" ? "孟子" : "Mencius",
      alternateName: locale === "zh" ? "孟轲" : "Meng Ke",
      description:
        locale === "zh"
          ? "战国时期的儒家思想家，思想主线包括性善、四端、仁政与浩然之气。"
          : "A Confucian thinker of the Warring States period whose thought turns on human nature, the four beginnings, humane government, and flood-like qi.",
    },
    mentions: content.entryLinks.map((item) => ({
      "@type": "WebPage",
      name: item.label,
      url: absolutePath(locale, item.path),
      description: item.note,
    })),
    isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
  };

  return (
    <main className="site-shell text-page">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="about" path="/about" />
      <section className="page-hero compact">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </section>
      <section className="text-flow">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{content.entryEyebrow}</p>
          <h2>{content.entryTitle}</h2>
        </div>
        <div className="article-grid">
          {content.entryLinks.map((item) => (
            <div className="text-flow compact-flow" key={item.path}>
              <h2>
                <a className="text-link" href={localPath(locale, item.path)}>
                  {item.label}
                </a>
              </h2>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
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
