# Metadata match after `467883e`

Date: Thursday, August 20, 2026

Scope:

- Compare the locally built `.next` HTML metadata against live production HTML metadata
- Target set: the `35` newly added passage editorial notes in commit `467883e`
- Locale coverage: `zh` and `en`
- Total checked pages: `70`

Result:

- `checked_pages = 70`
- `mismatch_count = 0`

Interpretation:

- Every newly added passage page in both locales returned the same `<title>` and `<meta name="description">` in production as in the local verified build
- This is strong evidence that the full `35`-passage editorial batch from `467883e` is live on `mengtzu.com`
