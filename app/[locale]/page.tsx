import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MenciusReader from "../MenciusReader";

export function generateStaticParams() { return [{ locale: "zh" }, { locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const zh = locale === "zh";
  return {
    title: zh ? "孟子全文｜简体中文、拼音与英译" : "The Mencius — Complete Chinese, Pinyin & English Text",
    description: zh ? "《孟子》十四卷、260章：简体原文、逐字拼音与 James Legge 公版英译。" : "All 260 passages of the Mencius with Chinese, aligned pinyin, and James Legge’s public-domain English translation.",
    alternates: { canonical: `https://www.mengtzu.com/${locale}`, languages: { "zh-Hans": "https://www.mengtzu.com/zh", en: "https://www.mengtzu.com/en", "x-default": "https://www.mengtzu.com/en" } }
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "zh" && locale !== "en") notFound();
  return <MenciusReader locale={locale}/>;
}
