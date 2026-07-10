import type { Metadata } from "next";
import {
  SITE_URL,
  alternateLanguages,
  alternateLocale,
  localeMeta,
  type Locale,
} from "./site";

type MetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  type?: "website" | "article";
};

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  type = "website",
}: MetadataInput): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: alternateLanguages(path),
    },
    openGraph: {
      type,
      url,
      siteName: localeMeta[locale].siteName,
      title,
      description,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: localeMeta[alternateLocale(locale)].ogLocale,
      images: [
        {
          url: "/images/mengzi-kano-sansetsu.jpg",
          width: 1030,
          height: 1752,
          alt: locale === "zh" ? "狩野山雪绘孟子像" : "Painting of Mengzi by Kano Sansetsu",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/mengzi-kano-sansetsu.jpg"],
    },
  };
}
