import { notFound } from "next/navigation";
import { socialImageContentType, socialImageSize, renderSocialCard } from "../../../lib/og";
import { getPrinciple, isLocale, type Locale } from "../../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Principle social card";

type ImageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const principle = getPrinciple(slug);
  if (!principle) notFound();

  const content = principle[locale];

  return renderSocialCard({
    locale,
    eyebrow: locale === "zh" ? `主题页 · ${content.shortTitle}` : `Principle page · ${content.shortTitle}`,
    title: content.title,
    description: content.directAnswer,
    accent: "#2563eb",
    footer: locale === "zh" ? `${principle.sourceRef} · 原文证据与实践路径` : `${principle.sourceRef} · textual evidence and practice path`,
    chips: locale === "zh" ? [content.shortTitle, "原文支点", "第一性原理"] : [content.shortTitle, "anchor passage", "first principle"],
  });
}
