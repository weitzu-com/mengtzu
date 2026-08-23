import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import { getSiteVerificationMetadata } from "../lib/runtime-config";
import { isLocale, localeMeta, locales, SITE_URL } from "../lib/site";

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
    metadataBase: new URL(SITE_URL),
    title: {
      default: localeMeta[locale].title,
      template: `%s | ${localeMeta[locale].siteName}`,
    },
    description: localeMeta[locale].description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    verification: getSiteVerificationMetadata(),
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const speculationRules = JSON.stringify({
    prerender: [
      {
        where: {
          or: [
            { href_matches: `/${locale}` },
            { href_matches: `/${locale}/*` },
          ],
        },
        eagerness: "moderate",
      },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <html lang={localeMeta[locale].htmlLang}>
      <body>
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: speculationRules }}
        />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
