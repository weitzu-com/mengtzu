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
  absoluteTitle?: boolean;
  socialImagePath?: string;
  socialImageAlt?: string;
  socialImageWidth?: number;
  socialImageHeight?: number;
};

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  type = "website",
  absoluteTitle = false,
  socialImagePath = SOCIAL_IMAGE_PATH,
  socialImageAlt = locale === "zh" ? "狩野山雪绘孟子像" : "Painting of Mengzi by Kano Sansetsu",
  socialImageWidth = 1030,
  socialImageHeight = 1752,
}: MetadataInput): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: absoluteTitle ? { absolute: title } : title,
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
          url: socialImagePath,
          width: socialImageWidth,
          height: socialImageHeight,
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImagePath],
    },
  };
}
