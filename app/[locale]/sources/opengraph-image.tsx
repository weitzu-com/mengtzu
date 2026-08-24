import { socialImageContentType, socialImageSize, renderSocialCard } from "../../lib/og";
import { isLocale, type Locale } from "../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Mencius sources social card";

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
    eyebrow: locale === "zh" ? "来源与授权" : "Sources and licensing",
    title:
      locale === "zh"
        ? "文本、图像与可核查出处"
        : "Texts, image credit, and checkable sources",
    description:
      locale === "zh"
        ? "中文核对本站 data/mengzi.json，英译沿用公版 James Legge，并保留回到原典核对的入口。"
        : "Chinese is checked against data/mengzi.json; English follows public-domain James Legge, with a path back to the primary text.",
    accent: "#24594d",
    footer: locale === "zh" ? "原典 · 授权 · 版本边界" : "Primary text · license · editorial limits",
    chips:
      locale === "zh"
        ? ["孟子原文", "James Legge", "图像授权"]
        : ["Mengzi text", "James Legge", "Image license"],
  });
}
