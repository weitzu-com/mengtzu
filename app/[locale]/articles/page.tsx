import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { articlePath, articles, articlesIndexContent, getReadyImage } from "../../lib/articles";
import { SITE_PUBLISHED, formatEditorialDate, getPathLastUpdated } from "../../lib/content-dates";
import { buildMetadata } from "../../lib/metadata";
import { absolutePath, isLocale, localPath, SITE_URL, type Locale } from "../../lib/site";
import { buildBreadcrumbJsonLd, buildMenciusPersonSchema } from "../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const content = articlesIndexContent[locale];
  return buildMetadata({
    locale,
    path: "/articles",
    title: content.title,
    description: content.description,
    absoluteTitle: locale === "en",
    socialImagePath: `/${locale}/articles/opengraph-image`,
    socialImageAlt: locale === "zh" ? "孟子专栏分享图" : "Mencius articles social card",
    socialImageWidth: 1200,
    socialImageHeight: 630,
  });
}

export default async function ArticlesIndexPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = articlesIndexContent[locale];
  const updatedAt = getPathLastUpdated("/articles");
  const breadcrumbItems = [
    { label: locale === "zh" ? "首页" : "Home", href: "" },
    { label: locale === "zh" ? "专栏" : "Articles", href: "/articles" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: content.title,
      description: content.description,
      url: absolutePath(locale, "/articles"),
      inLanguage: locale === "zh" ? "zh-CN" : "en",
      isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
      datePublished: SITE_PUBLISHED,
      dateModified: updatedAt,
      about: buildMenciusPersonSchema(locale),
      hasPart: articles.map((article) => ({
        "@type": "Article",
        headline: article[locale].title,
        url: absolutePath(locale, articlePath(article.slug)),
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
      })),
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
  ];

  return (
    <main className="site-shell text-page">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="articles" path="/articles" />
      <Breadcrumbs locale={locale} items={breadcrumbItems} />

      <section className="page-hero compact">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.h1}</h1>
        <p>{content.lead}</p>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{content.listTitle}</p>
          <h2>{locale === "zh" ? `${articles.length} 篇文章，逐篇回到原文` : `${articles.length} ${articles.length === 1 ? "article" : "articles"}, each anchored in the text`}</h2>
        </div>
        {articles.length === 0 ? (
          <p>{content.empty}</p>
        ) : (
          <div className="article-card-list">
            {articles.map((article) => {
              const local = article[locale];
              const hero = getReadyImage(article, article.heroImage);
              const href = localPath(locale, articlePath(article.slug));
              return (
                <article className="article-card" key={article.slug}>
                  {hero ? (
                    <a className="article-card-media" href={href} aria-hidden="true" tabIndex={-1}>
                      <Image
                        src={hero.src!}
                        alt=""
                        width={hero.width!}
                        height={hero.height!}
                        sizes="(max-width: 860px) 100vw, 360px"
                      />
                    </a>
                  ) : null}
                  <div className="article-card-body">
                    <p className="eyebrow">
                      {local.eyebrow} · {content.updatedLabel} {formatEditorialDate(article.updatedAt)}
                    </p>
                    <h3>
                      <a className="text-link" href={href}>
                        {local.title}
                      </a>
                    </h3>
                    <p>{local.description}</p>
                    <p className="article-card-keywords">
                      {article.targetQueries[locale].slice(0, 4).join(locale === "zh" ? " · " : " · ")}
                    </p>
                    <a className="text-link" href={href}>
                      {content.readMore}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <SiteFooter locale={locale} updatedAt={updatedAt} />
    </main>
  );
}
