import { bookSlugs, corpus, passageSlug } from "../mencius-data";
import { pagePaths, principles } from "./site";

export const SITE_PUBLISHED = "2026-07-10";
export const SITE_CONTENT_REFRESHED = "2026-08-20";

// These dates are explicit editorial milestones, not git-derived timestamps.
// The repository history currently contains future-dated entries relative to
// Thursday, August 20, 2026, so production freshness signals must come from
// curated content milestones instead of commit metadata.
const STATIC_ROUTE_LAST_UPDATED = {
  [pagePaths.home]: SITE_CONTENT_REFRESHED,
  [pagePaths.principles]: SITE_CONTENT_REFRESHED,
  [pagePaths.books]: SITE_CONTENT_REFRESHED,
  [pagePaths.quotes]: SITE_CONTENT_REFRESHED,
  [pagePaths.method]: SITE_CONTENT_REFRESHED,
  [pagePaths.about]: SITE_CONTENT_REFRESHED,
  [pagePaths.sources]: SITE_PUBLISHED,
  [pagePaths.faq]: SITE_CONTENT_REFRESHED,
} as const satisfies Record<string, string>;

const PRINCIPLE_ROUTE_LAST_UPDATED = Object.fromEntries(
  principles.map((principle) => [`/principles/${principle.slug}`, SITE_CONTENT_REFRESHED]),
);

const BOOK_ROUTE_LAST_UPDATED = Object.fromEntries(
  bookSlugs.map((slug) => [`/books/${slug}`, SITE_CONTENT_REFRESHED]),
);

const PASSAGE_ROUTE_LAST_UPDATED = Object.fromEntries(
  bookSlugs.flatMap((slug, index) =>
    corpus.chapters[index].passages.map((passage) => [
      `/books/${slug}/${passageSlug(passage.ref)}`,
      SITE_CONTENT_REFRESHED,
    ]),
  ),
);

const PATH_LAST_UPDATED = new Map<string, string>([
  ...Object.entries(STATIC_ROUTE_LAST_UPDATED),
  ...Object.entries(PRINCIPLE_ROUTE_LAST_UPDATED),
  ...Object.entries(BOOK_ROUTE_LAST_UPDATED),
  ...Object.entries(PASSAGE_ROUTE_LAST_UPDATED),
]);

function normalizePath(path = "") {
  if (path === "/") return "";
  if (path.length > 1 && path.endsWith("/")) {
    return path.replace(/\/+$/, "");
  }

  return path;
}

export function getPathLastUpdated(path = "") {
  return PATH_LAST_UPDATED.get(normalizePath(path)) ?? SITE_CONTENT_REFRESHED;
}

export function getSiteLastUpdated(paths = Object.keys(STATIC_ROUTE_LAST_UPDATED)) {
  return paths.reduce((latest, path) => {
    const current = getPathLastUpdated(path);
    return current > latest ? current : latest;
  }, SITE_PUBLISHED);
}
