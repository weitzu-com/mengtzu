import { socialImageContentType, socialImageSize, renderSocialCard } from "../../lib/og";
import { isLocale, type Locale } from "../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Mencius full text social card";

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
    eyebrow: locale === "zh" ? "《孟子》全文目录" : "The Mencius complete text",
    title:
      locale === "zh"
        ? "十四卷目录，二百六十章稳定引用路径"
        : "Fourteen parts and 260 stable passage routes",
    description:
      locale === "zh"
        ? "目录页负责导航，章句页负责证据。按卷进入，按问题回链，适合读者、搜索与 AI 引用。"
        : "The index navigates the structure and the passage pages carry the proof, so readers, search systems, and AI tools can cite the text with precision.",
    accent: "#b45309",
    footer: locale === "zh" ? "14 卷 · 260 章 · 稳定原典入口" : "14 parts · 260 passages · stable textual spine",
    chips:
      locale === "zh"
        ? ["义利之辨", "四端", "舍生取义", "民为贵"]
        : ["Profit and right", "Four beginnings", "Choose righteousness", "The people are weightiest"],
  });
}
