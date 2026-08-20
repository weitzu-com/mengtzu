import { socialImageContentType, socialImageSize, renderSocialCard } from "../../lib/og";
import { isLocale, type Locale } from "../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "About Mencius social card";

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
    eyebrow: locale === "zh" ? "孟子简介" : "Who is Mencius?",
    title:
      locale === "zh"
        ? "从第一性原理进入《孟子》"
        : "A first-principles introduction to Mencius",
    description:
      locale === "zh"
        ? "回答孟子是谁、为什么其思想围绕性善与仁政展开，以及第一次阅读应从哪里进入。"
        : "Answer who Mencius is, why his thought turns on human nature and humane government, and where a first-time reader should begin.",
    accent: "#7c3aed",
    footer: locale === "zh" ? "人物词入口 · 主题骨架 · 原典回链" : "Name-query hub · conceptual map · return to text",
    chips:
      locale === "zh"
        ? ["孟子是谁", "为什么重要", "从哪里开始"]
        : ["Who is Mencius", "Why he matters", "Where to begin"],
  });
}
