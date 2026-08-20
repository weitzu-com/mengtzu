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
    routeCards: [
      {
        title: "从性善与四端进入原典",
        body: "若你在找“孟子怎样理解人性”“四端从哪里来”，先从性善主题页进入，再回到《告子上》《公孙丑上》的关键章句。",
        primary: { label: "查看性善主题页", path: "/principles/xing-shan" },
        secondary: { label: "打开《告子上》全文", path: "/books/gao-zi-i" },
      },
      {
        title: "从仁政与民本进入原典",
        body: "若你在找“孟子的政治思想”“民为贵”“王道”，先抓仁政主题页，再回到《梁惠王》上下两卷。",
        primary: { label: "查看仁政主题页", path: "/principles/ren-zheng" },
        secondary: { label: "打开《梁惠王上》全文", path: "/books/liang-hui-wang-i" },
      },
      {
        title: "从修身与尽心进入原典",
        body: "若你在找“如何保存本心”“如何读孟子谈修养”，先看读法与尽心相关内容，再进入《尽心》上下两卷。",
        primary: { label: "查看读法页", path: "/method" },
        secondary: { label: "打开《尽心上》全文", path: "/books/jin-xin-i" },
      },
      {
        title: "从名句与出处快速进入",
        body: "若你先是从名句进入，再回头要找原文章句和完整语境，就先看名言页，再回到具体 passage 页面。",
        primary: { label: "查看名言页", path: "/quotes" },
        secondary: { label: "打开《公孙丑上》2A.6", path: "/books/gong-sun-chou-i/2a-6" },
      },
    ],
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
        question: "《孟子》到底是一部书，还是一组作品？",
        answer: "传统上《孟子》是七篇原典。本站把它按上下拆成十四卷来导航，所以既可以把它看作一部完整经典，也可以把它看作一组可逐卷、逐章进入的作品结构。",
      },
      {
        question: "在哪里可以读《孟子》中文原文？",
        answer: "这页下面的十四卷与 260 个章句页都提供中文原文入口；重点章句还附带逐字拼音与英文对照，方便从中文原典直接进入。",
      },
      {
        question: "《孟子》有哪些作品结构？",
        answer: "传统上《孟子》分七篇，而本站按上下分成十四卷来导航，共 260 个章句独立页面。这样既保留原典结构，也更适合稳定引用和搜索返回。",
      },
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
    routeCards: [
      {
        title: "Enter the full text through human nature and the four beginnings",
        body: "If your question is about human nature, compassion, or the four beginnings, start from the human nature page and then return to Gao Zi I and Gong Sun Chou I.",
        primary: { label: "Open human nature", path: "/principles/xing-shan" },
        secondary: { label: "Open Gao Zi I", path: "/books/gao-zi-i" },
      },
      {
        title: "Enter the works of Mencius through humane government",
        body: "If your question is about political legitimacy, the people, or kingly rule, start from humane government and then move into King Hui of Liang I and II.",
        primary: { label: "Open humane government", path: "/principles/ren-zheng" },
        secondary: { label: "Open King Hui of Liang I", path: "/books/liang-hui-wang-i" },
      },
      {
        title: "Enter through self-cultivation and exhausting the heart",
        body: "If your question is about preserving the heart, few desires, or mature cultivation, use the method page and then read Jin Xin I and II as part of the full text route.",
        primary: { label: "Open the method page", path: "/method" },
        secondary: { label: "Open Jin Xin I", path: "/books/jin-xin-i" },
      },
      {
        title: "Enter through quotes, then return to the proof text",
        body: "If you first arrived through a famous line, use the quotes page as the fast route back to the source passage and its full textual setting.",
        primary: { label: "Open Mencius quotes", path: "/quotes" },
        secondary: { label: "Open Mencius 2A.6", path: "/books/gong-sun-chou-i/2a-6" },
      },
    ],
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
        question: "What is the Mencius book?",
        answer: "Traditionally the Mencius is a seven-book classic. This site presents that book as fourteen readable parts and 260 passage pages, so the structure stays navigable while each citation stays stable.",
      },
      {
        question: "Where can I read Mencius in Chinese?",
        answer: "Use the fourteen-part index and the 260 passage pages below. They lead directly into the Chinese text, and key passages also expose pinyin and English alongside the original.",
      },
      {
        question: "What are the works of Mencius?",
        answer: "Traditionally the Mencius is arranged as seven books. This site presents them as fourteen parts and 260 passage pages so the structure stays readable while each citation stays stable.",
      },
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
    routeCards: {
      title: string;
      body: string;
      primary: { label: string; path: string };
      secondary: { label: string; path: string };
    }[];
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
    title: locale === "zh" ? "《孟子》全文：十四卷目录与原文入口" : "Mencius full text: fourteen-part complete text",
    description:
      locale === "zh"
        ? "《孟子》全文目录与作品结构入口：七篇分成十四卷、二百六十章独立页面，提供原文、拼音、英文对照与稳定引用路径。"
        : "Read the Mencius full text through fourteen parts and 260 passages, with Chinese, pinyin, English, and stable routes for citation and search.",
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
        <p className="eyebrow">{zh ? "《孟子》全文 · 七篇 · 上下十四卷 · 二百六十章" : "Mencius full text · seven books · fourteen parts · 260 passages"}</p>
        <h1>{zh ? "《孟子》全文与作品结构入口" : "Mencius full text and works of Mencius"}</h1>
        <p>
          {zh
            ? "这页既是《孟子》全文目录，也是“孟子有哪些作品、从哪里开始读原典”的统一入口。每一卷和每一章句都有独立页面，可作为解释、引用、搜索与 AI 检索的原典证据。"
            : "This page is both the Mencius full-text index and the direct answer to what the Mencius book is, what the works of Mencius are, and where to start reading them in Chinese or English. Every part and passage has its own page, so interpretation can point back to a stable textual source."}
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
          <p className="eyebrow">{zh ? "按问题进入原典" : "Enter the text by question"}</p>
          <h2>
            {zh
              ? "别只把《孟子》当目录，先判断你在问哪类问题"
              : "Do not treat the Mencius as a bare index; first decide what question you are asking"}
          </h2>
        </div>
        <div className="article-grid">
          {content.routeCards.map((item) => (
            <div className="text-flow compact-flow" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <div className="related-link-list">
                <a className="text-link" href={localPath(locale, item.primary.path)}>
                  {item.primary.label}
                </a>
                <a className="text-link" href={localPath(locale, item.secondary.path)}>
                  {item.secondary.label}
                </a>
              </div>
            </div>
          ))}
        </div>
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
