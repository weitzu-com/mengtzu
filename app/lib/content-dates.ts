import { bookSlugs, corpus, passageSlug } from "../mencius-data";
import { pagePaths, principles } from "./site";

export const SITE_PUBLISHED = "2026-07-10";
export const SITE_PUBLISHED_AT = "2026-07-10T00:00:00.000Z";
export const SITE_CONTENT_REFRESHED = "2026-08-20";
export const FLOW_HYGIENE_REFRESHED = "2026-08-24";

// These dates are explicit editorial milestones, not git-derived timestamps.
// The repository history currently contains future-dated entries relative to
// Thursday, August 20, 2026, so production freshness signals must come from
// curated content milestones instead of commit metadata.
//
// The goal is not perfect commit-time reconstruction. The goal is to stop
// overstating freshness sitewide. The August 20, 2026 wave is editorial notes
// and hub copy. The August 24, 2026 timestamps mark the Toyota flow-hygiene
// pass on hubs this branch actually changed. Passage lastmods stay on their
// own milestones instead of claiming a sitewide refresh.
const CORE_PASSAGE_UPDATED_AT = "2026-08-20T12:00:00.000Z";
const POLITICAL_PASSAGE_UPDATED_AT = "2026-08-20T14:00:00.000Z";
const CULTIVATION_PASSAGE_UPDATED_AT = "2026-08-20T16:00:00.000Z";
const COMPLETION_PASSAGE_UPDATED_AT = "2026-08-20T18:00:00.000Z";
const FLOW_HYGIENE_REFRESHED_AT = "2026-08-24T16:00:00.000Z";
const BOOK_HUB_REFRESHED_AT = FLOW_HYGIENE_REFRESHED_AT;
const METHOD_REFRESHED_AT = FLOW_HYGIENE_REFRESHED_AT;
const PRINCIPLE_REFRESHED_AT = FLOW_HYGIENE_REFRESHED_AT;
const QUOTES_REFRESHED_AT = FLOW_HYGIENE_REFRESHED_AT;
const SEO_ANCHOR_PASSAGE_REFRESHED_AT = "2026-08-20T20:00:00.000Z";
const DISCOVERY_REFRESHED_AT = FLOW_HYGIENE_REFRESHED_AT;
const HOME_AND_ABOUT_REFRESHED_AT = FLOW_HYGIENE_REFRESHED_AT;
const TARGETED_HUB_QUERY_REFRESHED_AT = FLOW_HYGIENE_REFRESHED_AT;

const CORE_PASSAGE_REFS = [
  "孟子 1B.10",
  "孟子 1B.11",
  "孟子 1B.12",
  "孟子 1B.13",
  "孟子 3B.5",
  "孟子 4B.4",
  "孟子 4B.6",
  "孟子 7A.19",
] as const;

const POLITICAL_PASSAGE_REFS = [
  "孟子 2A.9",
  "孟子 3B.1",
  "孟子 4A.21",
  "孟子 4A.22",
  "孟子 4B.20",
  "孟子 7A.10",
  "孟子 7A.12",
  "孟子 7A.14",
] as const;

const CULTIVATION_PASSAGE_REFS = [
  "孟子 3B.3",
  "孟子 4A.24",
  "孟子 4A.25",
  "孟子 4A.28",
  "孟子 4B.13",
  "孟子 4B.17",
  "孟子 6B.14",
  "孟子 7A.18",
  "孟子 1B.9",
  "孟子 2B.8",
  "孟子 3B.8",
  "孟子 3B.9",
  "孟子 6B.4",
  "孟子 7A.23",
  "孟子 7A.29",
  "孟子 7A.40",
  "孟子 1B.15",
  "孟子 2B.10",
  "孟子 2B.12",
  "孟子 3B.7",
  "孟子 5B.1",
  "孟子 5B.3",
  "孟子 7A.30",
  "孟子 7A.41",
  "孟子 4A.7",
  "孟子 4B.29",
  "孟子 4B.33",
  "孟子 5B.4",
  "孟子 7B.5",
  "孟子 7B.9",
  "孟子 7B.12",
  "孟子 7B.15",
  "孟子 4B.10",
  "孟子 4B.31",
  "孟子 4B.32",
  "孟子 7A.28",
  "孟子 7A.31",
  "孟子 7A.34",
  "孟子 7A.36",
  "孟子 7B.6",
  "孟子 7B.11",
] as const;

const COMPLETION_PASSAGE_REFS = [
  "孟子 2B.2",
  "孟子 2B.5",
  "孟子 2B.11",
  "孟子 2B.14",
  "孟子 7A.43",
  "孟子 7A.44",
  "孟子 7A.45",
  "孟子 7A.46",
  "孟子 7A.32",
  "孟子 7B.7",
  "孟子 7B.10",
  "孟子 7B.17",
  "孟子 7B.18",
  "孟子 7B.19",
  "孟子 7B.21",
  "孟子 7B.22",
  "孟子 7B.23",
  "孟子 7B.25",
  "孟子 7B.27",
  "孟子 7B.28",
  "孟子 7B.29",
  "孟子 7B.30",
  "孟子 7B.34",
  "孟子 7B.36",
  "孟子 7B.37",
  "孟子 7B.38",
  "孟子 1B.16",
  "孟子 2B.6",
  "孟子 2B.7",
  "孟子 2B.13",
  "孟子 3B.10",
  "孟子 5A.8",
  "孟子 5A.9",
  "孟子 5B.2",
  "孟子 6B.5",
] as const;

const SEO_ANCHOR_PASSAGE_REFS = [
  "孟子 1A.7",
  "孟子 2A.6",
  "孟子 6A.6",
  "孟子 6A.15",
  "孟子 7B.14",
] as const;

const PASSAGE_PATH_BY_REF = new Map(
  corpus.chapters.flatMap((chapter, index) =>
    chapter.passages.map((passage) => [
      passage.ref,
      `/books/${bookSlugs[index]}/${passageSlug(passage.ref)}`,
    ] as const),
  ),
);

function buildPassageMilestoneEntries(refs: readonly string[], updatedAt: string) {
  return refs.flatMap((ref) => {
    const path = PASSAGE_PATH_BY_REF.get(ref);
    return path ? [[path, updatedAt] as const] : [];
  });
}

const STATIC_ROUTE_LAST_UPDATED = {
  [pagePaths.home]: HOME_AND_ABOUT_REFRESHED_AT,
  [pagePaths.principles]: PRINCIPLE_REFRESHED_AT,
  [pagePaths.books]: BOOK_HUB_REFRESHED_AT,
  [pagePaths.quotes]: QUOTES_REFRESHED_AT,
  [pagePaths.method]: METHOD_REFRESHED_AT,
  [pagePaths.about]: TARGETED_HUB_QUERY_REFRESHED_AT,
  [pagePaths.sources]: DISCOVERY_REFRESHED_AT,
  [pagePaths.faq]: DISCOVERY_REFRESHED_AT,
} as const satisfies Record<string, string>;

const PRINCIPLE_ROUTE_LAST_UPDATED = Object.fromEntries(
  principles.map((principle) => {
    const path = `/principles/${principle.slug}`;
    const updatedAt =
      principle.slug === "si-duan" || principle.slug === "ren-zheng"
        ? TARGETED_HUB_QUERY_REFRESHED_AT
        : PRINCIPLE_REFRESHED_AT;

    return [path, updatedAt];
  }),
);

const BOOK_ROUTE_LAST_UPDATED = Object.fromEntries(
  bookSlugs.map((slug) => [`/books/${slug}`, BOOK_HUB_REFRESHED_AT]),
);

const PASSAGE_ROUTE_LAST_UPDATED = new Map<string, string>(
  bookSlugs.flatMap((slug, index) =>
    corpus.chapters[index].passages.map((passage) => [
      `/books/${slug}/${passageSlug(passage.ref)}`,
      SITE_PUBLISHED_AT,
    ]),
  ),
);

for (const [path, updatedAt] of [
  ...buildPassageMilestoneEntries(CORE_PASSAGE_REFS, CORE_PASSAGE_UPDATED_AT),
  ...buildPassageMilestoneEntries(POLITICAL_PASSAGE_REFS, POLITICAL_PASSAGE_UPDATED_AT),
  ...buildPassageMilestoneEntries(CULTIVATION_PASSAGE_REFS, CULTIVATION_PASSAGE_UPDATED_AT),
  ...buildPassageMilestoneEntries(COMPLETION_PASSAGE_REFS, COMPLETION_PASSAGE_UPDATED_AT),
  ...buildPassageMilestoneEntries(SEO_ANCHOR_PASSAGE_REFS, SEO_ANCHOR_PASSAGE_REFRESHED_AT),
]) {
  PASSAGE_ROUTE_LAST_UPDATED.set(path, updatedAt);
}

const PATH_LAST_UPDATED = new Map<string, string>([
  ...Object.entries(STATIC_ROUTE_LAST_UPDATED),
  ...Object.entries(PRINCIPLE_ROUTE_LAST_UPDATED),
  ...Object.entries(BOOK_ROUTE_LAST_UPDATED),
  ...PASSAGE_ROUTE_LAST_UPDATED.entries(),
]);

function normalizePath(path = "") {
  if (path === "/") return "";
  if (path.length > 1 && path.endsWith("/")) {
    return path.replace(/\/+$/, "");
  }

  return path;
}

export function getPathLastUpdated(path = "") {
  return PATH_LAST_UPDATED.get(normalizePath(path)) ?? SITE_PUBLISHED_AT;
}

export function formatEditorialDate(value: string) {
  return value.split("T")[0];
}

export function getSiteLastUpdated(paths = Object.keys(STATIC_ROUTE_LAST_UPDATED)) {
  return paths.reduce((latest, path) => {
    const current = getPathLastUpdated(path);
    return current.localeCompare(latest) > 0 ? current : latest;
  }, SITE_PUBLISHED_AT);
}
