import type { MetadataRoute } from "next";
import { bookSlugs, corpus, passageSlug } from "./mencius-data";
import { getPathLastUpdated } from "./lib/content-dates";
import {
  absolutePath,
  alternateLanguages,
  locales,
  pagePaths,
  principles,
} from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = Object.values(pagePaths);
  const principlePaths = principles.map((principle) => `/principles/${principle.slug}`);
  const bookPaths = bookSlugs.flatMap((slug, index) => [
    `/books/${slug}`,
    ...corpus.chapters[index].passages.map((passage) => `/books/${slug}/${passageSlug(passage.ref)}`),
  ]);

  return locales.flatMap((locale) =>
    [...staticPaths, ...principlePaths, ...bookPaths].map((path) => ({
      url: absolutePath(locale, path),
      lastModified: getPathLastUpdated(path),
      changeFrequency: path === "" || path === "/books" ? "weekly" : "monthly",
      priority:
        path === ""
          ? 1
          : path === "/books"
            ? 0.9
            : path.startsWith("/principles/") || path.startsWith("/books/")
              ? 0.8
              : 0.7,
      alternates: {
        languages: alternateLanguages(path),
      },
    })),
  );
}
