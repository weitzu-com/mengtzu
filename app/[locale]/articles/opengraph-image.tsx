import { articles } from "../../lib/articles";
import { socialImageContentType, socialImageSize, renderSocialCard } from "../../lib/og";
import { isLocale, type Locale } from "../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Mencius articles social card";

type ImageProps = {
  params: Promise<{ locale: string }>;
};

function getLocale(value: string): Locale {
  return isLocale(value) ? value : "en";
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const locale = getLocale((await params).locale);

  return renderSocialCard({
    locale,
    eyebrow: locale === "zh" ? "孟子专栏" : "Mencius articles",
    title:
      locale === "zh"
        ? "把真实搜索问题写成可核查的文章"
        : "Real search questions, answered from the text",
    description:
      locale === "zh"
        ? "每篇文章先给直接答案，再回到《孟子》原文章句、相关主题页与常见误解。"
        : "Each article gives a direct answer first, then returns to the Mencius passages, related principle pages, and common misreadings.",
    accent: "#0f766e",
    footer:
      locale === "zh"
        ? `${articles.length} 篇文章 · 原文回链 · 原创插图`
        : `${articles.length} ${articles.length === 1 ? "article" : "articles"} · passage links · original illustrations`,
    chips: locale === "zh" ? ["性善论", "四端", "仁政", "名言出处"] : ["Human nature", "Four beginnings", "Humane government", "Quotes"],
  });
}
