import { socialImageContentType, socialImageSize, renderSocialCard } from "../lib/og";
import { isLocale, type Locale } from "../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "mengtzu.com social card";

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
    eyebrow: locale === "zh" ? "首页 · 第一性原理读孟子" : "Home · Reading Mencius from first principles",
    title:
      locale === "zh"
        ? "孟子：把人心的微光，扩充成天下的秩序"
        : "Mencius: from the unbearable heart to humane order",
    description:
      locale === "zh"
        ? "从性善、四端、仁政与浩然之气进入《孟子》，并把问题重新接回原文、出处与双语证据。"
        : "Enter Mencius through human nature, the four beginnings, humane government, and flood-like qi, then return to passages and source-aware evidence.",
    accent: "#0f766e",
    footer: locale === "zh" ? "2 语种 · 4 主题 · 260 章句" : "2 languages · 4 themes · 260 passages",
    chips:
      locale === "zh"
        ? ["性善", "四端", "仁政", "浩然之气"]
        : ["Human nature", "Four beginnings / four sprouts", "Humane government / kingly way", "Flood-like qi"],
  });
}
