import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { SITE_PUBLISHED, getPathLastUpdated } from "../../lib/content-dates";
import { buildMetadata } from "../../lib/metadata";
import { SITE_URL, aboutContent, absolutePath, isLocale, localPath, type Locale } from "../../lib/site";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildMenciusPersonSchema } from "../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const aboutMetrics = {
  zh: [
    ["7", "七篇原典"],
    ["14", "上下十四卷"],
    ["260", "章句独立页面"],
    ["2", "双语阅读入口"],
  ],
  en: [
    ["7", "core books"],
    ["14", "fourteen parts"],
    ["260", "standalone passages"],
    ["2", "reading languages"],
  ],
} satisfies Record<Locale, [string, string][]>;

const aboutFaqs = {
  zh: [
    {
      question: "孟子是谁？",
      answer:
        "孟子是战国时期最重要的儒家思想家之一。理解他，不能只记名句，而要抓住他对人的根本判断：人心里已经有可以被保存、扩充并落实为制度与人格的善端。",
    },
    {
      question: "孟子最重要的思想主线是什么？",
      answer:
        "最关键的是把性善、四端、仁政和浩然之气连成一条线：先说明人为什么有道德开端，再说明政治和修身如何围绕这个开端展开。",
    },
    {
      question: "为什么这个网站不只做名句摘录？",
      answer:
        "因为只摘名句容易把《孟子》压扁成口号。本站要做的是把人物词、主题词、名句词都重新接回原文出处、问题脉络和可核查来源。",
    },
    {
      question: "如果第一次读《孟子》，应该从哪里进入？",
      answer:
        "最稳妥的路径是先读四个主题页，再看名句页，最后回到十四卷和具体章句。这样先抓骨架，再回到证据，不容易把原典读散。",
      path: "/principles",
      cta: "先进入四个主题",
    },
    {
      question: "为什么还会看到“孟轲”“Mencius”“Mengzi”“Mengtzu”这些不同名字？",
      answer:
        "因为它们指向同一个人物实体，只是来自中文本名、拉丁化方案和西方传统拼写的不同路径。本站会把这些别名重新收束到同一个孟子人物页和对应思想路径。",
    },
    {
      question: "孟子和孟轲是同一个人吗？",
      answer:
        "是同一个人。孟子是通行称呼，孟轲是其本名；Mencius、Mengzi、Meng Tzu、Mengtzu 只是不同语言和拼写传统下的对应写法，不是不同人物。",
    },
  ],
  en: [
    {
      question: "Who is Mencius?",
      answer:
        "Mencius is one of the most important Confucian thinkers of the Warring States period. He matters because he starts from a claim about the human heart and builds ethics, education, and politics from that starting point.",
    },
    {
      question: "What is the main thread of Mencius's thought?",
      answer:
        "The main thread links human nature, the four beginnings, humane government, and flood-like qi. First he explains why moral beginnings are real; then he explains how self-cultivation and public order should grow from them.",
    },
    {
      question: "Why is this site more than a quote collection?",
      answer:
        "Because detached sayings flatten the text. This site is designed to reconnect name, source passage, problem, and explanatory route, so both readers and machines can cite Mencius with more precision.",
    },
    {
      question: "Where should a new reader begin?",
      answer:
        "Start with the four principle pages, then use the quotes hub, and only then move into the fourteen-part text and passage pages. That order gives the skeleton first and the textual evidence second.",
      path: "/principles",
      cta: "Start with the four themes",
    },
    {
      question: "Why do people also write Mencius as Mengzi, Meng Ke, Meng Tzu, or Mengtzu?",
      answer:
        "They point to the same person through different transliteration systems and older Western spellings. This site keeps those aliases tied back to one Mencius entity page and one consistent reading path.",
    },
    {
      question: "Is Mengtzu the same as Mencius?",
      answer:
        "Yes. Mengtzu, Mengzi, Meng Ke, Meng Tzu, and Mencius all refer to the same historical thinker. The spellings come from different transliteration habits, not from different people.",
    },
  ],
} satisfies Record<Locale, { question: string; answer: string; path?: string; cta?: string }[]>;

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
    socialImagePath: `/${locale}/about/opengraph-image`,
    socialImageAlt: locale === "zh" ? "孟子简介分享图" : "Who is Mencius social card",
    socialImageWidth: 1200,
    socialImageHeight: 630,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = aboutContent[locale];
  const metrics = aboutMetrics[locale];
  const faqs = aboutFaqs[locale];
  const updatedAt = getPathLastUpdated("/about");
  const personSchema = buildMenciusPersonSchema(locale);
  const breadcrumbItems = [
    { label: locale === "zh" ? "首页" : "Home", href: "" },
    { label: locale === "zh" ? "孟子简介" : "About Mencius", href: "/about" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: content.title,
      description: content.description,
      url: absolutePath(locale, "/about"),
      mainEntityOfPage: absolutePath(locale, "/about"),
      mainEntity: personSchema,
      about: personSchema,
      mentions: content.entryLinks.map((item) => ({
        "@type": "WebPage",
        name: item.label,
        url: absolutePath(locale, item.path),
        description: item.note,
      })),
      datePublished: SITE_PUBLISHED,
      dateModified: updatedAt,
      isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
    buildFaqPageJsonLd(absolutePath(locale, "/about"), content.title, faqs),
  ];

  return (
    <main className="site-shell text-page">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="about" path="/about" />
      <Breadcrumbs locale={locale} items={breadcrumbItems} />
      <section className="page-hero compact">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </section>

      <section className="metric-grid" aria-label={locale === "zh" ? "孟子简介页结构" : "About Mencius page structure"}>
        {metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="answer-section">
        <div className="section-heading">
          <p className="eyebrow">{locale === "zh" ? "直接回答" : "Direct answers"}</p>
          <h2>
            {locale === "zh"
              ? "把“孟子是谁、为什么重要、从哪里开始”一次说清楚"
              : "Answer who Mencius is, why he matters, and where to begin"}
          </h2>
        </div>
        <div className="answer-list">
          {faqs.map((item) => (
            <article className="answer-item" key={item.question}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
              {item.path && item.cta ? (
                <a className="text-link" href={localPath(locale, item.path)}>
                  {item.cta}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="text-flow">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{content.aliasEyebrow}</p>
          <h2>{content.aliasTitle}</h2>
        </div>
        <div className="principle-grid page-grid">
          {content.aliases.map((alias) => (
            <div className="small-card" key={alias}>
              {alias}
            </div>
          ))}
        </div>
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
      <SiteFooter locale={locale} updatedAt={updatedAt} />
    </main>
  );
}
