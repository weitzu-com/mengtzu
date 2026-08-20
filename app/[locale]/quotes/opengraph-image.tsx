import { socialImageContentType, socialImageSize, renderSocialCard } from "../../lib/og";
import { isLocale, type Locale } from "../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Mencius quotes social card";

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
    eyebrow: locale === "zh" ? "孟子名言与出处" : "Mencius quotes with sources",
    title:
      locale === "zh"
        ? "别把名句浮成口号，先把它放回原文"
        : "Put the quote back into the argument, not just the slogan",
    description:
      locale === "zh"
        ? "从舍生取义、民为贵、反求诸己等高意图名句进入，再回到原文出处、相关主题和完整论证。"
        : "Enter through high-intent lines such as choosing righteousness or the people are weightiest, then return to the source passage, related principle, and full argument.",
    accent: "#dc2626",
    footer: locale === "zh" ? "12 条名句 · 原文出处 · 主题回链" : "12 quotes · source passages · theme backlinks",
    chips:
      locale === "zh"
        ? ["舍生取义", "民为贵", "反求诸己", "养心莫善于寡欲"]
        : ["Choose righteousness", "The people are weightiest", "Turn inward", "Make desires few"],
  });
}
