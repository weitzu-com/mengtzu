import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { SITE_PUBLISHED, getPathLastUpdated } from "../../lib/content-dates";
import { buildMetadata } from "../../lib/metadata";
import { absolutePath, faqContent, isLocale, type Locale } from "../../lib/site";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from "../../lib/seo";

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
    path: "/faq",
    title: faqContent[locale].title,
    description: faqContent[locale].description,
  });
}

export default async function FaqPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = faqContent[locale];
  const updatedAt = getPathLastUpdated("/faq");
  const breadcrumbItems = [
    { label: locale === "zh" ? "首页" : "Home", href: "" },
    { label: locale === "zh" ? "问答" : "FAQ", href: "/faq" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: content.title,
      description: content.description,
      url: absolutePath(locale, "/faq"),
      inLanguage: locale === "zh" ? "zh-CN" : "en",
      datePublished: SITE_PUBLISHED,
      dateModified: updatedAt,
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
    buildFaqPageJsonLd(
      absolutePath(locale, "/faq"),
      content.title,
      content.questions.map((item) => ({ question: item.question, answer: item.answer })),
    ),
  ];

  return (
    <main className="site-shell text-page">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="faq" path="/faq" />
      <Breadcrumbs locale={locale} items={breadcrumbItems} />
      <section className="page-hero compact">
        <p className="eyebrow">{locale === "zh" ? "问答" : "FAQ"}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </section>

      <section className="answer-list">
        {content.questions.map((item) => (
          <article className="answer-item" key={item.question}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <SiteFooter locale={locale} updatedAt={updatedAt} />
    </main>
  );
}
