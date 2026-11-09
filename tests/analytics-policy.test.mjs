import assert from "node:assert/strict";
import test from "node:test";
import {
  PRODUCTION_HOSTNAME,
  PRODUCTION_MEASUREMENT_ID,
  buildReaderContinueEvent,
  shouldCollectProductionAnalytics,
  shouldEmitPageView,
} from "../app/lib/analytics-policy.mjs";

test("production analytics requires the canonical host and the one measurement id", () => {
  assert.equal(PRODUCTION_HOSTNAME, "www.mengtzu.com");
  assert.equal(PRODUCTION_MEASUREMENT_ID, "G-9ZP2CP09R7");
  assert.equal(
    shouldCollectProductionAnalytics({
      hostname: "www.mengtzu.com",
      measurementId: "G-9ZP2CP09R7",
    }),
    true,
  );

  for (const hostname of [
    "mengtzu.com",
    "localhost",
    "sites-plugin-sites-openai-bundled-flax.vercel.app",
    "mengtzu-git-preview.vercel.app",
    "www.sun-tzu.ai",
    "",
  ]) {
    assert.equal(
      shouldCollectProductionAnalytics({ hostname, measurementId: "G-9ZP2CP09R7" }),
      false,
      hostname,
    );
  }

  assert.equal(
    shouldCollectProductionAnalytics({
      hostname: "www.mengtzu.com",
      measurementId: "G-OTHER",
    }),
    false,
  );
  assert.equal(
    shouldCollectProductionAnalytics({
      hostname: "www.mengtzu.com",
      measurementId: null,
    }),
    false,
  );
});

test("a document emits one pageview, and a prerender emits none until activation", () => {
  assert.deepEqual(
    shouldEmitPageView({ prerendering: false, pagePath: "/en/principles/si-duan", alreadySent: false }),
    { emit: true, reason: "navigation" },
  );
  assert.deepEqual(
    shouldEmitPageView({ prerendering: false, pagePath: "/en/principles/si-duan", alreadySent: true }),
    { emit: false, reason: "duplicate" },
  );
  assert.deepEqual(
    shouldEmitPageView({ prerendering: true, pagePath: "/en/books/gong-sun-chou-i/2a-6", alreadySent: false }),
    { emit: false, reason: "prerendering" },
  );
  assert.deepEqual(shouldEmitPageView({ prerendering: false, pagePath: "", alreadySent: false }), {
    emit: false,
    reason: "missing-path",
  });
});

test("reader_continue records only the locale, surface, and path", () => {
  assert.deepEqual(
    buildReaderContinueEvent({
      locale: "en",
      surface: "passage_pager",
      destinationPath: "/en/books/gong-sun-chou-i/2a-7",
    }),
    {
      name: "reader_continue",
      params: {
        locale: "en",
        surface: "passage_pager",
        destination_path: "/en/books/gong-sun-chou-i/2a-7",
      },
    },
  );

  assert.equal(
    buildReaderContinueEvent({
      locale: "zh",
      surface: "principle_source",
      destinationPath: "/zh/books/liang-hui-wang-i/1a-7",
    })?.params.destination_path,
    "/zh/books/liang-hui-wang-i/1a-7",
  );

  for (const input of [
    { locale: "en", surface: "passage_pager", destinationPath: "/zh/books/gong-sun-chou-i/2a-6" },
    { locale: "en", surface: "purchase", destinationPath: "/en/books" },
    { locale: "en", surface: "passage_pager", destinationPath: "/en/books/gong-sun-chou-i/2a-6?q=孟子\n" },
    { locale: "en", surface: "passage_pager", destinationPath: "https://www.mengtzu.com/en/books" },
    { locale: "en", surface: "passage_pager", destinationPath: "/en/books/gong-sun-chou-i/2a-6#note" },
    { locale: "fr", surface: "passage_pager", destinationPath: "/fr/books" },
    { locale: "en", surface: "passage_pager", destinationPath: "/en/books/child at the well" },
  ]) {
    assert.equal(buildReaderContinueEvent(input), null, JSON.stringify(input));
  }

  const payload = buildReaderContinueEvent({
    locale: "zh",
    surface: "principle_source",
    destinationPath: "/zh/principles/si-duan",
  });
  assert.deepEqual(Object.keys(payload.params).sort(), ["destination_path", "locale", "surface"]);
  assert.equal(JSON.stringify(payload).includes("email"), false);
  assert.equal(JSON.stringify(payload).includes("user_id"), false);
});
