import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { buildMetadata } from "../../lib/metadata";
import { SITE_URL, absolutePath, isLocale, type Locale } from "../../lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const methodContent = {
  zh: {
    title: "读法：从第一性原理重读《孟子》",
    description:
      "不先接受结论，而是从原话、问题、前提、推理、边界和今日应用重新阅读《孟子》，帮助读者形成可核验的理解链与现实判断。",
    eyebrow: "不背答案 · 追问根本",
    h1: "先拆开，再理解。",
    lead:
      "第一性原理不是把古人的话包装成现代口号，而是暂时放下权威，从最基本的事实和假设开始，重新检查一条论证为什么成立。",
    steps: [
      ["确认原话", "先确定孟子究竟说了什么，保留上下文、对话对象和章节位置，不用转述代替原文。"],
      ["还原问题", "区分表面提问与根本矛盾：讨论的是利益、秩序、人性，还是行动者真正承担的责任。"],
      ["找出前提", "把没有明说的判断写出来，例如人是否具有恻隐之心、制度是否会放大人的选择。"],
      ["检查推理", "观察结论如何从前提推出，辨认类比、反问、归谬和经验判断各自承担什么作用。"],
      ["测试边界", "问它在什么条件下成立，遇到哪些反例会失效，避免把一句话无限扩大。"],
      ["回到今日", "不急于套用，而是把原则转化为今天可以观察、讨论和验证的问题。"],
    ],
  },
  en: {
    title: "Method: reading the Mencius from first principles",
    description:
      "A six-step method for reading the Mencius through text, problem, premise, reasoning, limits, and present application.",
    eyebrow: "Do not inherit the answer · Rebuild the argument",
    h1: "Take it apart. Then understand it.",
    lead:
      "First-principles reading does not turn an ancient text into a modern slogan. It temporarily sets authority aside and asks which observations, assumptions, and inferences make an argument stand.",
    steps: [
      ["Establish the words", "Begin with what Mencius actually says. Keep the speaker, audience, context, and canonical location visible."],
      ["Recover the problem", "Separate the surface question from the underlying conflict: profit, order, human nature, or responsibility."],
      ["Expose the premise", "State the assumptions that remain implicit, such as whether compassion is innate or institutions amplify choice."],
      ["Inspect the reasoning", "Trace how the conclusion follows and what work is done by analogy, reversal, reductio, and observation."],
      ["Test the boundary", "Ask under which conditions the principle holds and which counterexamples would make it fail."],
      ["Return to the present", "Do not force an application. Turn the principle into a question that can be observed, debated, and tested today."],
    ],
  },
} satisfies Record<Locale, { title: string; description: string; eyebrow: string; h1: string; lead: string; steps: [string, string][] }>;

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  return buildMetadata({
    locale,
    path: "/method",
    title: methodContent[locale].title,
    description: methodContent[locale].description,
    absoluteTitle: locale === "en",
  });
}

export default async function MethodPage({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  const content = methodContent[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: content.title,
    description: content.description,
    url: absolutePath(locale, "/method"),
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    publisher: { "@type": "Organization", name: "mengtzu.com", url: SITE_URL },
    step: content.steps.map(([name, text], index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name,
      text,
    })),
  };

  return (
    <main className="site-shell text-page">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="method" path="/method" />
      <section className="page-hero compact">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.h1}</h1>
        <p>{content.lead}</p>
      </section>
      <section className="method-grid">
        {content.steps.map(([title, body], index) => (
          <article className="answer-item" key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
