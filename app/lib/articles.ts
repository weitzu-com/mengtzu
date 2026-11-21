import { articleSources } from "../../content/articles";
import type { Locale } from "./site";

export type ArticleImage = {
  file: string;
  src?: string;
  prompt: string;
  aspectRatio: string;
  alt: Record<Locale, string>;
  caption?: Record<Locale, string>;
  width?: number | null;
  height?: number | null;
  status: "pending" | "ready";
  generatedBy?: string;
  generatedAt?: string;
  revisedPrompt?: string;
};

export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; cite?: string; href?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "image"; image: string };

export type ArticleLocaleContent = {
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  keyTakeaways: string[];
  blocks: ArticleBlock[];
  faq: { question: string; answer: string }[];
  relatedLinks: { path: string; label: string; note: string }[];
};

export type Article = {
  slug: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  targetQueries: Record<Locale, string[]>;
  evidence?: string;
  sourceRefs: string[];
  heroImage: string;
  images: Record<string, ArticleImage>;
  zh: ArticleLocaleContent;
  en: ArticleLocaleContent;
};

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

function fail(slug: string, message: string): never {
  throw new Error(`content/articles/${slug}.json: ${message}`);
}

function validateLocaleContent(slug: string, locale: Locale, content: ArticleLocaleContent, images: Record<string, ArticleImage>) {
  for (const field of ["title", "description", "eyebrow", "h1", "lead"] as const) {
    if (typeof content[field] !== "string" || !content[field].trim()) fail(slug, `${locale}.${field} is required`);
  }
  if (locale === "zh" && content.description.length < 50) fail(slug, "zh.description must be at least 50 characters");
  if (locale === "en" && content.title.length > 60) fail(slug, `en.title is ${content.title.length} characters; keep it at 60 or fewer`);
  if (locale === "en" && content.description.length > 160) fail(slug, `en.description is ${content.description.length} characters; keep it at 160 or fewer`);
  if (!Array.isArray(content.blocks) || content.blocks.length < 4) fail(slug, `${locale}.blocks needs at least four blocks`);
  if (!Array.isArray(content.faq) || content.faq.length < 2) fail(slug, `${locale}.faq needs at least two entries`);
  if (!Array.isArray(content.keyTakeaways) || content.keyTakeaways.length < 2) fail(slug, `${locale}.keyTakeaways needs at least two entries`);
  if (!Array.isArray(content.relatedLinks) || content.relatedLinks.length < 1) fail(slug, `${locale}.relatedLinks needs at least one internal link`);
  for (const block of content.blocks) {
    if (block.type === "image" && !images[block.image]) fail(slug, `${locale} references unknown image "${block.image}"`);
  }
}

function validateArticle(article: Article): Article {
  if (!SLUG.test(article.slug)) fail(article.slug, "slug must be lowercase kebab-case");
  if (!ISO_DATE_TIME.test(article.publishedAt)) fail(article.slug, "publishedAt must be an ISO UTC timestamp");
  if (!ISO_DATE_TIME.test(article.updatedAt)) fail(article.slug, "updatedAt must be an ISO UTC timestamp");
  if (!Array.isArray(article.keywords) || article.keywords.length < 3) fail(article.slug, "keywords needs at least three entries");
  if (!article.images?.[article.heroImage]) fail(article.slug, `heroImage "${article.heroImage}" is not defined in images`);
  for (const [key, image] of Object.entries(article.images)) {
    if (!image.prompt?.trim()) fail(article.slug, `images.${key}.prompt is required`);
    if (!image.alt?.zh || !image.alt?.en) fail(article.slug, `images.${key}.alt needs zh and en`);
    if (image.status === "ready" && (!image.src || !image.width || !image.height)) {
      fail(article.slug, `images.${key} is marked ready but lacks src/width/height`);
    }
  }
  validateLocaleContent(article.slug, "zh", article.zh, article.images);
  validateLocaleContent(article.slug, "en", article.en, article.images);
  return article;
}

export const articles: Article[] = (articleSources as unknown as Article[])
  .map(validateArticle)
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

const slugs = new Set(articles.map((article) => article.slug));
if (slugs.size !== articles.length) {
  throw new Error("content/articles: duplicate article slugs detected");
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function articlePath(slug: string) {
  return `/articles/${slug}`;
}

export function getReadyImage(article: Article, key: string) {
  const image = article.images[key];
  if (!image || image.status !== "ready" || !image.src || !image.width || !image.height) return null;
  return image;
}

export function getArticlesLastUpdated() {
  return articles.reduce((latest, article) => (article.updatedAt.localeCompare(latest) > 0 ? article.updatedAt : latest), "");
}

export const articlesIndexContent = {
  zh: {
    title: "孟子专栏：基于真实搜索问题的深度文章",
    description:
      "mengtzu.com 专栏按真实搜索需求逐篇撰写：性善论与性恶论的区别、四端与仁政如何落地、名句该如何回到原文。每篇文章都回到具体章句，并配有原创插图。",
    eyebrow: "专栏",
    h1: "孟子专栏：把搜索问题写成可核查的文章",
    lead:
      "这里的每一篇文章都从一个真实的搜索问题出发，先给直接答案，再回到《孟子》原文章句、相关主题页与常见误解。目标不是堆砌名句，而是让读者、搜索引擎和 AI 系统都能引用到准确的出处。",
    listTitle: "全部文章",
    empty: "专栏文章正在陆续上线。",
    readMore: "阅读全文",
    updatedLabel: "更新",
  },
  en: {
    title: "Mencius articles: answers to real search questions",
    description:
      "In-depth articles written from real search demand: Mencius versus Xunzi on human nature, how the four beginnings and humane government work, and how to cite quotes properly.",
    eyebrow: "Articles",
    h1: "Mencius articles built from real search questions",
    lead:
      "Each article starts from a question people actually search for, gives a direct answer first, and then returns to the Mencius passages, the related principle pages, and the common misreadings. The aim is precise, citable explanation rather than piles of quotations.",
    listTitle: "All articles",
    empty: "Articles are being published one at a time.",
    readMore: "Read the article",
    updatedLabel: "Updated",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    lead: string;
    listTitle: string;
    empty: string;
    readMore: string;
    updatedLabel: string;
  }
>;
