import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { bookSlugs, corpus, englishBookNames, simplifiedBookNames } from "../../mencius-data";
import { buildMetadata } from "../../lib/metadata";
import { buildFaqPageJsonLd } from "../../lib/seo";
import { SITE_URL, absolutePath, isLocale, localPath, type Locale } from "../../lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const booksHubContent = {
  zh: {
    metrics: [
      ["14", "上下十四卷"],
      ["260", "章句独立页面"],
      ["2", "中英双语路径"],
      ["1", "稳定引用入口"],
    ] as [string, string][],
    starterPassages: [
      {
        ref: "孟子 1A.1",
        title: "何必曰利：先抓住义利之辨",
        note: "如果你想知道孟子为什么一开篇就把政治从“利”拉回“仁义”，这里是最稳的起点。",
        path: "/books/liang-hui-wang-i/1a-1",
      },
      {
        ref: "孟子 2A.6",
        title: "孺子将入于井：先抓住四端",
        note: "若你关心性善与道德起点，这一章是理解孟子最重要的支点之一。",
        path: "/books/gong-sun-chou-i/2a-6",
      },
      {
        ref: "孟子 6A.10",
        title: "舍生取义：先看价值排序",
        note: "这章最适合处理“义为什么能高于生存本能”这个高意图问题。",
        path: "/books/gao-zi-i/6a-10",
      },
      {
        ref: "孟子 7B.14",
        title: "民为贵：先看政治合法性",
        note: "若你从政治问题进入孟子，这一章最直接回答百姓、社稷和君位的排序。",
        path: "/books/jin-xin-ii/7b-14",
      },
    ],
    faqs: [
      {
        question: "为什么把《孟子》做成十四卷、二百六十章的独立页面？",
        answer: "因为稳定引用和搜索检索都需要稳定 URL。卷级页负责导航，章句页负责给出可精确返回的原文证据。",
      },
      {
        question: "第一次读《孟子》，应该先看全文目录还是直接进章句？",
        answer: "如果还没有骨架，先看目录与主题页；如果已经有明确问题，就直接进入对应章句，再回到主题页比较。",
      },
      {
        question: "这页和主题页、名句页的关系是什么？",
        answer: "这页是原典导航中心。主题页负责问题骨架，名句页负责高频入口，而这页负责把所有进入路径接回完整文本结构。",
      },
    ],
  },
  en: {
    metrics: [
      ["14", "fourteen parts"],
      ["260", "standalone passages"],
      ["2", "bilingual reading paths"],
      ["1", "stable citation spine"],
    ] as [string, string][],
    starterPassages: [
      {
        ref: "Mencius 1A.1",
        title: "Why profit cannot lead the argument",
        note: "If you want the opening dispute between profit and righteousness, this is the clearest beginning.",
        path: "/books/liang-hui-wang-i/1a-1",
      },
      {
        ref: "Mencius 2A.6",
        title: "The child at the well and the four beginnings",
        note: "For readers entering through human goodness and moral psychology, this is one of the strongest anchor passages.",
        path: "/books/gong-sun-chou-i/2a-6",
      },
      {
        ref: "Mencius 6A.10",
        title: "Choosing righteousness over life",
        note: "This passage is the cleanest route into Mencius on value order and the moral scale above survival.",
        path: "/books/gao-zi-i/6a-10",
      },
      {
        ref: "Mencius 7B.14",
        title: "The people are weightiest",
        note: "If you enter Mencius through political legitimacy, this passage gives the ranked answer most directly.",
        path: "/books/jin-xin-ii/7b-14",
      },
    ],
    faqs: [
      {
        question: "Why turn the Mencius into fourteen parts and 260 passage pages?",
        answer: "Because stable citation and retrieval both need stable URLs. The part pages navigate the structure, and the passage pages provide precise textual proof.",
      },
      {
        question: "Should a new reader start from the full-text index or jump straight into a passage?",
        answer: "If you do not yet have a map, begin with the index and the topic hubs. If you already have a question, jump to the passage and then work back to the principle page.",
      },
      {
        question: "How does this page relate to the topic hubs and the quotes page?",
        answer: "This page is the textual navigation center. The topic hubs give the conceptual skeleton, the quotes page gives high-intent entry points, and this index ties every route back to the text itself.",
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    metrics: [string, string][];
    starterPassages: { ref: string; title: string; note: string; path: string }[];
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
    path: "/books",
    title: locale === "zh" ? "《孟子》十四卷全文目录" : "The Mencius: fourteen-part complete text",
    description:
      locale === "zh"
        ? "《孟子》十四卷、二百六十章独立页面目录，提供简体原文、逐字拼音和英文对照入口，并可作为稳定的引用与检索路径。"
        : "A complete index of the fourteen parts and 260 passages of the Mencius, with Chinese, pinyin, and English reading pages.",
    socialImagePath: `/${locale}/books/opengraph-image`,
    socialImageAlt: locale === "zh" ? "孟子全文目录分享图" : "Mencius full text index social card",
    socialImageWidth: 1200,
    socialImageHeight: 630,
  });
}

export default async function BooksPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const zh = locale === "zh";
  const content = booksHubContent[locale];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: zh ? "《孟子》十四卷全文目录" : "The Mencius complete text index",
      url: absolutePath(locale, "/books"),
      inLanguage: zh ? "zh-CN" : "en",
      isPartOf: { "@type": "WebSite", name: "mengtzu.com", url: SITE_URL },
      hasPart: corpus.chapters.map((chapter, index) => ({
        "@type": "CreativeWork",
        name: zh ? simplifiedBookNames[index] : englishBookNames[index],
        url: absolutePath(locale, `/books/${bookSlugs[index]}`),
        position: index + 1,
        hasPart: chapter.passages.length,
      })),
    },
    buildFaqPageJsonLd(
      absolutePath(locale, "/books"),
      zh ? "《孟子》十四卷全文目录" : "The Mencius complete text index",
      content.faqs,
    ),
  ];

  return (
    <main className="site-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="books" path="/books" />

      <section className="page-hero compact">
        <p className="eyebrow">{zh ? "七篇 · 上下十四卷 · 二百六十章" : "Seven books · Fourteen parts · 260 passages"}</p>
        <h1>{zh ? "《孟子》全文目录" : "The Mencius complete text"}</h1>
        <p>
          {zh
            ? "每一卷和每一章句都有独立页面，可作为解释、引用、搜索与 AI 检索的原典证据。"
            : "Every part and passage has its own page, so interpretation can point back to a stable textual source."}
        </p>
      </section>

      <section className="metric-grid" aria-label={zh ? "全文目录结构" : "Full text index structure"}>
        {content.metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{zh ? "从这里开始" : "Start here"}</p>
          <h2>{zh ? "四个最适合第一次进入《孟子》的章句支点" : "Four passage anchors that work best for a first entry into the Mencius"}</h2>
        </div>
        <div className="article-grid">
          {content.starterPassages.map((item) => (
            <div className="text-flow compact-flow" key={item.path}>
              <span className="book-ref">{item.ref}</span>
              <h2>
                <a className="text-link" href={localPath(locale, item.path)}>
                  {item.title}
                </a>
              </h2>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="book-card-grid">
        {corpus.chapters.map((chapter, index) => (
          <a className="book-card" key={chapter.id} href={localPath(locale, `/books/${bookSlugs[index]}`)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{zh ? simplifiedBookNames[index] : englishBookNames[index]}</h2>
            <p>
              {chapter.passages.length} {zh ? "章" : "passages"} · {chapter.name}
            </p>
          </a>
        ))}
      </section>

      <section className="answer-section">
        <div className="section-heading">
          <p className="eyebrow">{zh ? "如何使用全文目录" : "How to use the full-text index"}</p>
          <h2>
            {zh
              ? "让目录页承担导航，让章句页承担证据"
              : "Let the index navigate the structure and let the passage pages carry the proof"}
          </h2>
        </div>
        <div className="answer-list">
          {content.faqs.map((item) => (
            <article className="answer-item" key={item.question}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
