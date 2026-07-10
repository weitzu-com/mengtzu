import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeMeta, locales } from "../lib/site";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return {
    metadataBase: new URL("https://www.mengtzu.com"),
    title: {
      default: localeMeta[locale].title,
      template: `%s | ${localeMeta[locale].siteName}`,
    },
    description: localeMeta[locale].description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={localeMeta[locale].htmlLang}>
      <body>{children}</body>
    </html>
  );
}
