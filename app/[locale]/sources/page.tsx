import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { SITE_PUBLISHED, getPathLastUpdated } from "../../lib/content-dates";
import { buildMetadata } from "../../lib/metadata";
import { buildBreadcrumbJsonLd } from "../../lib/seo";
import { SITE_URL, absolutePath, isLocale, sourcesContent, type Locale } from "../../lib/site";

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
    path: "/sources",
    title: sourcesContent[locale].title,
    description: sourcesContent[locale].description,
  });
}

export default async function SourcesPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = sourcesContent[locale];
  const updatedAt = getPathLastUpdated("/sources");
  const breadcrumbItems = [
    { label: locale === "zh" ? "首页" : "Home", href: "" },
    { label: locale === "zh" ? "来源" : "Sources", href: "/sources" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: content.title,
      description: content.description,
      url: absolutePath(locale, "/sources"),
      datePublished: SITE_PUBLISHED,
      dateModified: updatedAt,
      isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
      citation: content.sections.flatMap((section) => section.items.map((item) => item.href)),
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
  ];

  return (
    <main className="site-shell text-page">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="sources" path="/sources" />
      <Breadcrumbs locale={locale} items={breadcrumbItems} />
      <section className="page-hero compact">
        <p className="eyebrow">{locale === "zh" ? "可核查来源" : "Verifiable sources"}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </section>

      <section className="source-list">
        {content.sections.map((section) => (
          <div className="source-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.items.map((item) => (
              <article className="source-item" key={item.href}>
                <h3>
                  <a href={item.href}>{item.label}</a>
                </h3>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        ))}
      </section>

      <SiteFooter locale={locale} updatedAt={updatedAt} />
    </main>
  );
}
