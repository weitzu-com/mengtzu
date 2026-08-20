import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { PrincipleCard } from "../../components/PrincipleCard";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { buildMetadata } from "../../lib/metadata";
import { buildFaqPageJsonLd } from "../../lib/seo";
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

const principlesHubContent = {
  zh: {
    metrics: [
      ["4", "核心主题页"],
      ["4", "高意图起点问题"],
      ["260", "可回溯章句证据"],
      ["2", "双语独立路径"],
    ] as [string, string][],
    startQuestions: [
      {
        title: "孟子到底怎样理解人？",
        answer: "先读性善。它处理的是所有后续修身、教育和政治判断的起点问题。",
        path: "/principles/xing-shan",
        cta: "进入性善",
      },
      {
        title: "德性为什么不是抽象口号？",
        answer: "先读四端。它把仁义礼智落到最小、最可观察的心之反应上。",
        path: "/principles/si-duan",
        cta: "进入四端",
      },
      {
        title: "政治为什么要从民生和合法性开始？",
        answer: "先读仁政。它解释政治秩序为何要回到百姓安顿与统治正当性。",
        path: "/principles/ren-zheng",
        cta: "进入仁政",
      },
      {
        title: "道德勇气如何稳定下来？",
        answer: "先读浩然之气。它说明长期合义行动如何沉淀为稳固人格力量。",
        path: "/principles/hao-ran-zhi-qi",
        cta: "进入浩然之气",
      },
    ],
    useRules: [
      {
        title: "先抓问题，再进原文",
        body: "主题页负责回答问题，章句页负责提供证据。先把问题问准，再回到原典，理解会更稳。",
      },
      {
        title: "相邻主题要互相比较",
        body: "性善讲起点，四端讲结构，仁政讲政治展开，浩然之气讲人格完成。四页最好连着看，而不是只摘一页。",
      },
      {
        title: "让主题页和章句页双向进入",
        body: "每个主题页都应把你送回原文证据，每个重点章句页也应把你带回对应主题，这样站点才会形成权威骨架。",
      },
    ],
    faqs: [
      {
        question: "孟子思想最核心的四个入口是什么？",
        answer: "性善、四端、仁政、浩然之气。这四个入口分别处理人的起点、德性的结构、政治的展开和人格力量的完成。",
      },
      {
        question: "第一次读孟子，应该先看哪一页？",
        answer: "最适合先看性善，因为它解释为什么孟子相信修身、教育和政治都必须从人的内在道德开端出发。",
      },
      {
        question: "主题页和章句页应该怎样配合？",
        answer: "主题页先建立问题骨架，章句页再回到原典证据。这样既不会把思想读空，也不会把原文读散。",
      },
    ],
  },
  en: {
    metrics: [
      ["4", "core topic pages"],
      ["4", "high-intent entry questions"],
      ["260", "traceable passage proofs"],
      ["2", "independent reading languages"],
    ] as [string, string][],
    startQuestions: [
      {
        title: "How does Mencius understand the human person?",
        answer: "Start with human nature. That page handles the starting point behind his later views on cultivation, education, and politics.",
        path: "/principles/xing-shan",
        cta: "Open human nature",
      },
      {
        title: "Why are virtues not just abstract names?",
        answer: "Start with the four beginnings. That page shows how benevolence, righteousness, ritual, and discernment become observable.",
        path: "/principles/si-duan",
        cta: "Open the four beginnings",
      },
      {
        title: "Why must politics begin from livelihood and legitimacy?",
        answer: "Start with humane government. That page explains why order must answer to the people's settlement and the ruler's justification.",
        path: "/principles/ren-zheng",
        cta: "Open humane government",
      },
      {
        title: "How does moral courage become stable?",
        answer: "Start with flood-like qi. That page explains how repeated right action settles into durable moral force.",
        path: "/principles/hao-ran-zhi-qi",
        cta: "Open flood-like qi",
      },
    ],
    useRules: [
      {
        title: "Begin with the question, then return to the text",
        body: "The hub pages answer the question first; the passage pages supply the evidence. That order keeps reading focused.",
      },
      {
        title: "Compare neighboring principles, not isolated slogans",
        body: "Human nature covers the start, the four beginnings cover structure, humane government covers political development, and flood-like qi covers mature moral force.",
      },
      {
        title: "Make the hub pages and passage pages point both ways",
        body: "A real authority site sends every principle back to passages and every important passage back to the governing principle behind it.",
      },
    ],
    faqs: [
      {
        question: "What are the four main entry points into Mencius?",
        answer: "Human nature, the four beginnings, humane government, and flood-like qi. Together they cover the start of moral life, the structure of virtue, political order, and mature moral force.",
      },
      {
        question: "Which page should a first-time reader start with?",
        answer: "Start with human nature, because it explains why Mencius thinks cultivation, education, and government must grow from an inner moral beginning.",
      },
      {
        question: "How should the topic pages and passage pages work together?",
        answer: "The topic pages provide the argumentative skeleton, and the passage pages provide the textual proof. Both are necessary if the site is to be explanatory rather than merely archival.",
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    metrics: [string, string][];
    startQuestions: { title: string; answer: string; path: string; cta: string }[];
    useRules: { title: string; body: string }[];
    faqs: { question: string; answer: string }[];
  }
>;

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
    socialImagePath: `/${locale}/principles/opengraph-image`,
    socialImageAlt: locale === "zh" ? "孟子思想主题页分享图" : "Mencius philosophy social card",
    socialImageWidth: 1200,
    socialImageHeight: 630,
  });
}

export default async function PrinciplesPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = principlesHubContent[locale];
  const title = locale === "zh" ? "孟子思想：四个核心主题页" : "Mencius philosophy: four core topic pages";
  const lead =
    locale === "zh"
      ? "如果只记住“性善”两个字，很难真正理解孟子。这页把孟子思想拆成四个独立主题：先给定义，再给第一性原理、实践路径、常见问题与原文入口。"
      : "Mencius cannot be reduced to a slogan about goodness. This hub breaks his philosophy into four independent topic pages with definitions, first principles, practice paths, common questions, and textual entry points.";

  const jsonLd = [
    {
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
    },
    buildFaqPageJsonLd(absolutePath(locale, "/principles"), title, content.faqs),
  ];

  return (
    <main className="site-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="principles" path="/principles" />

      <section className="page-hero compact">
        <p className="eyebrow">{locale === "zh" ? "孟子思想" : "Mencius philosophy"}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </section>

      <section className="metric-grid" aria-label={locale === "zh" ? "主题页结构" : "Principles hub structure"}>
        {content.metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="answer-section">
        <div className="section-heading">
          <p className="eyebrow">{locale === "zh" ? "从问题进入" : "Enter by question"}</p>
          <h2>
            {locale === "zh"
              ? "先判断你在问哪类问题，再进入对应主题页"
              : "Decide which question you are asking, then enter the matching topic page"}
          </h2>
        </div>
        <div className="answer-list">
          {content.startQuestions.map((item) => (
            <article key={item.path} className="answer-item">
              <h2>{item.title}</h2>
              <p>{item.answer}</p>
              <a className="text-link" href={localPath(locale, item.path)}>
                {item.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="principle-grid page-grid">
        {principles.map((principle) => (
          <PrincipleCard key={principle.slug} locale={locale} principle={principle} />
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{locale === "zh" ? "使用原则" : "How to use this hub"}</p>
          <h2>
            {locale === "zh"
              ? "把主题页和章句页连成一条学习与引用链"
              : "Turn the hub pages and passage pages into one reading and citation chain"}
          </h2>
        </div>
        <div className="article-grid">
          {content.useRules.map((item) => (
            <div className="text-flow compact-flow" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
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
