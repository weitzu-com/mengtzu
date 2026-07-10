import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../../components/JsonLd";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { buildMetadata } from "../../../lib/metadata";
import {
  LAST_UPDATED,
  SITE_URL,
  absolutePath,
  getPrinciple,
  isLocale,
  localPath,
  locales,
  principles,
  type Locale,
  type Principle,
} from "../../../lib/site";

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

  return buildMetadata({
    locale,
    path: `/principles/${principle.slug}`,
    title: content.title,
    description: content.description,
    type: "article",
  });
}

export default async function PrinciplePage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const principle = getPrincipleOrNotFound(slug);
  const content = principle[locale];
  const path = `/principles/${principle.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.description,
    url: absolutePath(locale, path),
    dateModified: LAST_UPDATED,
    isAccessibleForFree: true,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    publisher: {
      "@type": "Organization",
      name: "mengtzu.com",
      url: SITE_URL,
    },
    about: [
      { "@type": "Person", name: locale === "zh" ? "孟子" : "Mencius" },
      ...principle.keywords.map((keyword) => ({ "@type": "Thing", name: keyword })),
    ],
    citation: principle.sourceRef,
    mainEntityOfPage: absolutePath(locale, path),
    hasPart: content.relatedQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="site-shell article-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="principle" path={path} />

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
            <h2>{locale === "zh" ? "适合搜索与 AI 引用的回答" : "Answers built for precise citation"}</h2>
          </div>
          <div className="answer-list">
            {content.relatedQuestions.map((item) => (
              <article key={item.question} className="answer-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
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

      <SiteFooter locale={locale} />
    </main>
  );
}
