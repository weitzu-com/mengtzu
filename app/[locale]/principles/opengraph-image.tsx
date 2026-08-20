import { socialImageContentType, socialImageSize, renderSocialCard } from "../../lib/og";
import { isLocale, type Locale } from "../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Mencius philosophy social card";

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
    eyebrow: locale === "zh" ? "孟子思想主题页" : "Mencius philosophy hub",
    title:
      locale === "zh"
        ? "性善、四端、仁政、浩然之气"
        : "Human nature, the four beginnings, humane government, and flood-like qi",
    description:
      locale === "zh"
        ? "先判断你在问人的起点、德性的结构、政治合法性，还是人格力量，然后进入对应主题页。"
        : "Decide whether you are asking about the human starting point, the structure of virtue, political legitimacy, or moral force, then enter the matching page.",
    accent: "#2563eb",
    footer: locale === "zh" ? "4 个主题页 · 260 个章句证据" : "4 topic pages · 260 passage proofs",
    chips:
      locale === "zh"
        ? ["性善", "四端", "仁政", "浩然之气"]
        : ["Human nature", "Four beginnings / four sprouts", "Humane government / kingly way", "Flood-like qi"],
  });
}
