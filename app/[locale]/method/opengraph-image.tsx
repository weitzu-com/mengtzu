import { socialImageContentType, socialImageSize, renderSocialCard } from "../../lib/og";
import { isLocale, type Locale } from "../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Mencius reading method social card";

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
    eyebrow: locale === "zh" ? "读法" : "Method",
    title:
      locale === "zh"
        ? "从第一性原理重读《孟子》"
        : "Reading the Mencius from first principles",
    description:
      locale === "zh"
        ? "先确认原话、还原问题、找出前提，再检查推理、测试边界，最后回到今日可核验的判断。"
        : "Establish the words, recover the problem, expose the premise, inspect the reasoning, test the boundary, and return to a present question.",
    accent: "#a33c22",
    footer: locale === "zh" ? "六步读法 · 回到 2A.6" : "Six steps · return to 2A.6",
    chips:
      locale === "zh"
        ? ["确认原话", "还原问题", "找出前提", "回到原文"]
        : ["Establish the words", "Recover the problem", "Expose the premise", "Return to the text"],
  });
}
