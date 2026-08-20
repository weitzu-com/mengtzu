# mengtzu.com SEO operations

Date: Thursday, August 20, 2026

## 1. Scope

This document covers the production-facing SEO operations that now exist in the repository but still need deployment or external account access to become live evidence.

## 2. Environment values required

Populate these variables in the production environment:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

The repository template lives in [.env.example](/Users/weiqinguang/Desktop/03_工作_工具/03_网站项目/mengtzu.com/production-repo/.env.example).

## 3. What the current code now supports

### Search verification

- Google verification meta tag via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- Bing verification meta tag via `NEXT_PUBLIC_BING_SITE_VERIFICATION`

### Analytics

- GA4 script loading via `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- CSP expansion for Google Analytics domains only when the measurement ID is present

### Route freshness

- Explicit content-date ledger in `app/lib/content-dates.ts`
- `sitemap.xml`, `llms.txt`, JSON-LD, article metadata, and footer dates all read from that ledger

### Feed discovery

- RSS autodiscovery link emitted through page metadata
- Static RSS feed at `https://mengtzu.com/feed.xml`
- Legacy `https://mengtzu.com/rss.xml` redirect path
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

Run the production crawl audit after deployment:

```bash
npm run audit:live -- --label <deployed-commit-or-note>
```

Dry run:

```bash
npm run audit:live -- --label preview --dry-run
```

The script writes evidence into:

- `reports/evidence/live-crawl-post-<label>.json`

## 6. Minimum post-deploy spot checks

### Technical

- `https://mengtzu.com/robots.txt`
- `https://mengtzu.com/sitemap.xml`
- `https://mengtzu.com/feed.xml`
- `https://mengtzu.com/en/about`
- `https://mengtzu.com/en/principles`
- `https://mengtzu.com/en/quotes`
- `https://mengtzu.com/en/books`

### What to verify

- canonical / hreflang still correct
- verification tags present if configured
- GA4 script present if configured
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
