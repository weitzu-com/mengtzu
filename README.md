# mengtzu.com

Bilingual Mencius site built from first principles and deployed on Vercel.

## Structure

- `/zh` and `/en` are independent language homes.
- `/zh/principles/*` and `/en/principles/*` explain core Mencius themes.
- `/zh/books/*` and `/en/books/*` expose the fourteen parts and 260 passage pages.
- `/zh/method`, `/zh/sources`, `/zh/faq`, `/sitemap.xml`, `/robots.txt`, and `/llms.txt` support SEO and GEO. Unprefixed `/method`, `/sources`, and `/faq` redirect to the default `/zh` tree.

## Content System

- `public/data/mencius.json` is the generated reading corpus.
- `data/mengzi.json` is the source text input.
- `scripts/build-mencius-data.mjs` rebuilds the corpus.

## Local Checks

```bash
npm run build
npm test
```
