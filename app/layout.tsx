import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "孟子 · Mèngzǐ — 中英拼音全文",
  description: "从第一性原理重读《孟子》：繁体原文、拼音与 James Legge 英译全文对照。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
