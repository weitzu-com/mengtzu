import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { JsonLd } from "../../../components/JsonLd";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { formatEditorialDate, getPathLastUpdated } from "../../../lib/content-dates";
import { buildMetadata } from "../../../lib/metadata";
import {
  absolutePath,
  getPrinciple,
  isLocale,
  localPath,
  locales,
  principles,
  type Locale,
  type Principle,
} from "../../../lib/site";
import {
  PUBLISHER_SCHEMA,
  buildAuthorSchema,
  SITE_PUBLISHED,
  buildMenciusPersonSchema,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  getRelatedPassagesForPrinciple,
} from "../../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

function getPrincipleOrNotFound(slug: string): Principle {
  const principle = getPrinciple(slug);
  if (!principle) notFound();
  return principle;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    principles.map((principle) => ({ locale, slug: principle.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const principle = getPrincipleOrNotFound(slug);
  const content = principle[locale];
  const updatedAt = getPathLastUpdated(`/principles/${principle.slug}`);

  return buildMetadata({
    locale,
    path: `/principles/${principle.slug}`,
    title: content.title,
    description: content.description,
    type: "article",
    socialImagePath: `/${locale}/principles/${principle.slug}/opengraph-image`,
    socialImageAlt: content.title,
    socialImageWidth: 1200,
    socialImageHeight: 630,
    publishedTime: SITE_PUBLISHED,
    modifiedTime: updatedAt,
  });
}

export default async function PrinciplePage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const principle = getPrincipleOrNotFound(slug);
  const content = principle[locale];
  const path = `/principles/${principle.slug}`;
  const relatedPassages = getRelatedPassagesForPrinciple(locale, principle.slug);
  const updatedAt = getPathLastUpdated(path);
  const breadcrumbItems = [
    { label: locale === "zh" ? "首页" : "Home", href: "" },
    { label: locale === "zh" ? "核心思想" : "Principles", href: "/principles" },
    { label: content.shortTitle, href: path },
  ];
  const socialImage = absolutePath(locale, `${path}/opengraph-image`);
  const personSchema = buildMenciusPersonSchema(locale);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: content.title,
      description: content.description,
      url: absolutePath(locale, path),
      mainEntityOfPage: absolutePath(locale, path),
      image: [socialImage],
      datePublished: SITE_PUBLISHED,
      dateModified: updatedAt,
      author: buildAuthorSchema(locale),
      publisher: PUBLISHER_SCHEMA,
      isAccessibleForFree: true,
      inLanguage: locale === "zh" ? "zh-CN" : "en",
      about: [
        personSchema,
        ...principle.keywords.map((keyword) => ({ "@type": "Thing", name: keyword })),
      ],
      citation: principle.sourceRef,
      hasPart: content.relatedQuestions.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
    buildFaqPageJsonLd(
      absolutePath(locale, path),
      content.title,
      content.relatedQuestions.map((item) => ({ question: item.question, answer: item.answer })),
    ),
  ];

  return (
    <main className="site-shell article-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="principle" path={path} />
      <Breadcrumbs locale={locale} items={breadcrumbItems} />

      <article>
        <header className="page-hero article-hero">
          <p className="eyebrow">{principle.sourceRef}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </header>

        <section className="definition-box">
          <h2>{locale === "zh" ? "直接定义" : "Direct definition"}</h2>
          <p>{content.definition}</p>
        </section>

        <section className="principle-grid page-grid">
          <div className="small-card">{principle.sourceRef}</div>
          <div className="small-card">
            <a className="text-link" href={localPath(locale, principle.textPath)}>
              {locale === "zh" ? "打开对应原文章句" : "Open the anchor passage"}
            </a>
          </div>
          <div className="small-card">
            {locale === "zh" ? "最近更新" : "Last updated"}: {formatEditorialDate(updatedAt)}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">{locale === "zh" ? "常见入口词" : "Search entry terms"}</p>
            <h2>{locale === "zh" ? "这页直接承接的高意图问题与别名" : "High-intent query terms this page answers directly"}</h2>
          </div>
          <div className="principle-grid page-grid">
            {content.entryTerms.map((term) => (
              <div className="small-card" key={term}>{term}</div>
            ))}
          </div>
        </section>

        <section className="article-grid">
          <div>
            <h2>{locale === "zh" ? "一句话回答" : "Direct answer"}</h2>
            <p>{content.directAnswer}</p>
          </div>
          <div>
            <h2>{locale === "zh" ? "原典线索" : "Classical anchor"}</h2>
            <blockquote>{content.classical}</blockquote>
          </div>
          <div>
            <h2>{locale === "zh" ? "第一性原理" : "First principle"}</h2>
            <p>{content.firstPrinciple}</p>
          </div>
          <div>
            <h2>{locale === "zh" ? "为什么重要" : "Why it matters"}</h2>
            <p>{content.whyItMatters}</p>
          </div>
          <div>
            <h2>{locale === "zh" ? "原文入口" : "Textual evidence"}</h2>
            <p>
              <a className="text-link" href={localPath(locale, principle.textPath)}>
                {locale === "zh" ? "打开对应《孟子》章句" : "Open the corresponding Mencius passage"}
              </a>
            </p>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">{locale === "zh" ? "实践路径" : "Practice path"}</p>
            <h2>{locale === "zh" ? "把思想落到可执行判断" : "Turn the idea into usable judgment"}</h2>
          </div>
          <ol className="practice-list">
            {content.practice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="answer-section">
          <div className="section-heading">
            <p className="eyebrow">{locale === "zh" ? "常见问题" : "Common questions"}</p>
            <h2>{locale === "zh" ? "把问题接回原典" : "Take the question back to the text"}</h2>
          </div>
          <div className="answer-list">
            {content.relatedQuestions.map((item) => (
              <article key={item.question} className="answer-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
                <a className="text-link" href={localPath(locale, item.path)}>
                  {item.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="answer-section">
          <div className="section-heading">
            <p className="eyebrow">{locale === "zh" ? "主题支点" : "Topic anchors"}</p>
            <h2>{locale === "zh" ? "相关章句支点" : "Related passage anchors"}</h2>
          </div>
          <div className="answer-list">
            {relatedPassages.map((item) => (
              <article key={item.href} className="answer-item">
                <p className="eyebrow">
                  {item.bookName} · {item.ref}
                </p>
                <h3>
                  <a className="text-link" href={item.href}>
                    {item.title}
                  </a>
                </h3>
                <p>
                  {item.isAnchor
                    ? locale === "zh"
                      ? "这是该主题的原文锚点页，用来固定定义与出处。"
                      : "This is the anchor passage that fixes the theme's core text and source."
                    : item.hasEditorialNote
                      ? locale === "zh"
                        ? "该页已有人类解释层，可直接承接更强的搜索与引用意图。"
                        : "This page already has a human-edited note, so it can absorb stronger search and citation intent."
                      : locale === "zh"
                        ? "该页可作为这一主题的原文支点，与主题页互相补强。"
                        : "This page serves as a textual support point for the theme and strengthens the hub page in return."}
                </p>
              </article>
            ))}
          </div>
        </section>
      </article>

      <section className="next-section">
        <h2>{locale === "zh" ? "返回核心思想索引" : "Back to the principle index"}</h2>
        <a className="primary-action" href={localPath(locale, "/principles")}>
          {locale === "zh" ? "查看全部主题" : "View all topics"}
        </a>
      </section>

      <SiteFooter locale={locale} updatedAt={updatedAt} />
    </main>
  );
}
