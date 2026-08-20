import type { Metadata } from "next";
import {
  SITE_URL,
  alternateLanguages,
  alternateLocale,
  localeMeta,
  type Locale,
} from "./site";
import { EDITOR_NAME, SOCIAL_IMAGE_PATH } from "./seo";

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
    authors: [{ name: EDITOR_NAME, url: `${SITE_URL}/en/about` }],
    creator: EDITOR_NAME,
    publisher: localeMeta[locale].siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
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
          url: SOCIAL_IMAGE_PATH,
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
      images: [SOCIAL_IMAGE_PATH],
    },
  };
}
