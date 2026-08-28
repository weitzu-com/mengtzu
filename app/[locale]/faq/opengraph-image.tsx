import { socialImageContentType, socialImageSize, renderSocialCard } from "../../lib/og";
import { isLocale, type Locale } from "../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Mencius FAQ social card";

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
    eyebrow: locale === "zh" ? "问答" : "FAQ",
    title:
      locale === "zh"
        ? "关于本站与孟子思想的常见问题"
        : "Questions about the site and reading Mencius",
    description:
      locale === "zh"
        ? "先问孟子是谁、如何进入四个主题，再回到章句原文，而不是停在口号层。"
        : "Ask who Mencius is and how to enter the four themes, then return to the passage instead of stopping at a slogan.",
    accent: "#b78d42",
    footer: locale === "zh" ? "问题 · 主题 · 原文" : "Question · theme · passage",
    chips:
      locale === "zh"
        ? ["孟子是谁", "四个主题", "回到原文"]
        : ["Who is Mencius", "Four themes", "Back to the text"],
  });
}
