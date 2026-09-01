# mengtzu.com SEO operations

Date: Thursday, August 20, 2026
External-state review: Tuesday, September 1, 2026

## 1. Scope

This document covers the production-facing SEO operations in the repository and
the dated external-service evidence needed to distinguish code support from live
delivery and account-side acceptance.

## 2. Environment values

Production analytics uses:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (configured and receiving production traffic)

These verification variables are optional. Populate one only when the
corresponding provider is being verified by HTML meta tag rather than DNS or
another provider-supported method:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`

The repository template lives in [.env.example](/Users/weiqinguang/Desktop/03_工作_工具/03_网站项目/mengtzu.com/production-repo/.env.example).

## 3. What the current code now supports

### Search verification

- Google verification meta tag via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- Bing verification meta tag via `NEXT_PUBLIC_BING_SITE_VERIFICATION`

### Analytics

- GA4 script loading via `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- explicit `page_view` dispatch on App Router route changes when GA4 is enabled
- CSP expansion for Google Analytics domains only when the measurement ID is present

### Route freshness

- Explicit content-date ledger in `app/lib/content-dates.ts`
- `sitemap.xml`, `llms.txt`, JSON-LD, article metadata, and footer dates all read from that ledger

### Feed discovery

- RSS autodiscovery link emitted through page metadata
- Static RSS feed at `https://www.mengtzu.com/feed.xml`
- Legacy `https://www.mengtzu.com/rss.xml` redirect path
- Footer and `llms.txt` both expose the feed URL

### Entity resolution

- Homepage and About page `Person` schema expose:
  - `alternateName`
  - `sameAs`
  for Mencius / Mengzi / Meng Ke / Mengtzu / 孟轲

## 4. Deploy checklist

1. Set the GA4 measurement ID and any verification variables required by the
   chosen provider verification method.
2. Deploy the current branch through the normal Vercel path.
3. Confirm that the deployed HTML contains:
   - Google or Bing verification meta tags when configured
   - GA4 script when configured
   - route-specific `dateModified`
   - entity `sameAs` links on homepage and About page
   - RSS autodiscovery link pointing to `/feed.xml`

## 5. Post-deploy audit

Run the fast production spot check first:

```bash
npm run audit:spot -- --label <deployed-commit-or-note>
```

The spot check treats `https://www.mengtzu.com` as canonical and also probes
`https://mengtzu.com/` plus a query-bearing deep path. Both apex probes must
reach their canonical `www` URL in exactly one redirect; a second redirect hop,
a changed deep-path query, or an unexpected final URL makes the command exit
non-zero. Keep both domains assigned to the Vercel project, with no Vercel
project-domain redirect on `mengtzu.com`, so the host-aware rules in
`next.config.ts` can send the apex root directly to `/zh`.

Then run the full production crawl audit:

```bash
npm run audit:live -- --label <deployed-commit-or-note>
```

Dry run:

```bash
npm run audit:live -- --label preview --dry-run
```

The script writes evidence into:

- `reports/evidence/production-spot-check-<label>.json`
- `reports/evidence/live-crawl-post-<label>.json`

The saved JSON now also includes a `codex_summary` block with:

- `route_group_counts`
- `route_group_response_ms`
- `x_vercel_cache_counts`
- `x_vercel_cache_by_route_group`
- `cache_control_counts`

Use that block to separate crawl latency and cache behavior by route family before opening Vercel.

## 6. Minimum post-deploy spot checks

Prefer the scripted spot check above before manual browsing. It standardizes:

- redirect behavior
- one-hop apex-to-`www` delivery, including `/` to `/zh` and query preservation
- title / canonical / hreflang presence
- RSS autodiscovery
- verification tags
- GA script presence
- `dateModified`
- `sameAs`
- Vercel cache header snapshots

### Technical

- `https://www.mengtzu.com/robots.txt`
- `https://www.mengtzu.com/sitemap.xml`
- `https://www.mengtzu.com/feed.xml`
- `https://www.mengtzu.com/en/about`
- `https://www.mengtzu.com/en/principles`
- `https://www.mengtzu.com/en/quotes`
- `https://www.mengtzu.com/en/books`

### What to verify

- canonical / hreflang still correct
- verification tags present if configured
- GA4 script present if configured
- GA4 pageview scaffold wired for client-side route changes in code
- `dateModified` present and route-appropriate
- entity aliases and `sameAs` visible in structured data
- RSS link present in page `<head>` and footer

## 7. External-service status

The following account-side evidence was verified on September 1, 2026:

- Google Search Console has an accessible `sc-domain:mengtzu.com` property, so
  an HTML verification token is not required for the current Google setup.
- `https://www.mengtzu.com/sitemap.xml` was submitted successfully in Search
  Console and reported 572 discovered pages.
- The Search Console index report, last updated August 28, reported 565 indexed
  pages and 12 excluded URLs. The exclusions split into four expected redirect
  URLs, six pre-canonical-host duplicate records, and two non-HTML/non-search
  resources (`llms.txt` and a versioned CSS asset).
- The current `/zh` URL is indexed. Validation of the six stale canonical-choice
  records started on September 1 after the one-hop apex redirect deployment.
- The GA4 web data stream is `https://www.mengtzu.com`, uses measurement ID
  `G-9ZP2CP09R7`, and reports that it received traffic in the preceding 48 hours.
  The latest seven-day view showed 7 active users, 34 events, and 10 views.

Still external or time-dependent:

- Bing Webmaster Tools account-side verification and ingestion were not
  confirmed in this review.
- Search Console validation and index counts are asynchronous; recheck them
  after Google finishes the validation run rather than treating the dated counts
  above as a permanent invariant.
- Core Web Vitals does not yet have enough field data for mobile or desktop.
