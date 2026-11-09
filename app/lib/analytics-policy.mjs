export const PRODUCTION_HOSTNAME = "www.mengtzu.com";
export const PRODUCTION_MEASUREMENT_ID = "G-9ZP2CP09R7";

const READER_SURFACES = new Set(["passage_pager", "principle_source"]);

export function shouldCollectProductionAnalytics({ hostname, measurementId }) {
  return hostname === PRODUCTION_HOSTNAME && measurementId === PRODUCTION_MEASUREMENT_ID;
}

export function shouldEmitPageView({ prerendering, pagePath, alreadySent }) {
  if (!pagePath) {
    return { emit: false, reason: "missing-path" };
  }

  if (prerendering) {
    return { emit: false, reason: "prerendering" };
  }

  if (alreadySent) {
    return { emit: false, reason: "duplicate" };
  }

  return { emit: true, reason: "navigation" };
}

export function buildReaderContinueEvent({ locale, surface, destinationPath }) {
  if (locale !== "zh" && locale !== "en") {
    return null;
  }

  if (!READER_SURFACES.has(surface)) {
    return null;
  }

  if (typeof destinationPath !== "string") {
    return null;
  }

  if (!destinationPath.startsWith(`/${locale}/`)) {
    return null;
  }

  if (destinationPath.includes("?") || destinationPath.includes("#") || destinationPath.includes("://")) {
    return null;
  }

  if (/\s/u.test(destinationPath)) {
    return null;
  }

  return {
    name: "reader_continue",
    params: {
      locale,
      surface,
      destination_path: destinationPath,
    },
  };
}
