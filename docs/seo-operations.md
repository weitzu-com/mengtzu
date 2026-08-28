# mengtzu.com SEO operations

Date: Thursday, August 20, 2026

## 1. Scope

This document covers the production-facing SEO operations that now exist in the repository but still need deployment or external account access to become live evidence.

## 2. Environment values required

Populate these variables in the production environment:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

The repository template lives in [.env.example](../.env.example).

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

1. Set the production environment variables above.
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

## 7. Remaining external blockers

The repository can now emit the required tags and scripts, but these still need external state:

- actual Google verification token
- actual Bing verification token
- actual GA4 measurement ID
- production deployment
- GSC / Bing / GA4 account-side verification that the tags are accepted
