# ZAS Tech — Static Homepage

This is a **static** landing page (no framework) with a premium dark UI, glass panels, soft glow, and a subtle neural-grid background.

**Production site:** [https://zas-tech.krd](https://zas-tech.krd)

## Run locally

- Open `index.html` in your browser, or
- Use a simple local server (recommended):

```powershell
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## SEO (Google Search Console)

- **Sitemap:** https://zas-tech.krd/sitemap.xml
- **Robots:** https://zas-tech.krd/robots.txt
- Page metadata lives in each HTML file; canonical URLs and structured data use `https://zas-tech.krd`.
- Central config: `seo/site.json` (titles, descriptions, sitemap priority).

### Regenerate sitemap & robots

After adding a new `.html` page at the site root, add its SEO entry to `seo/site.json`, then run:

```powershell
npm run generate:sitemap
```

On **Netlify**, `netlify.toml` runs this automatically on every deploy.

### Google Search Console checklist

1. Verify property for `https://zas-tech.krd`
2. Submit sitemap: `https://zas-tech.krd/sitemap.xml`
3. Request indexing for `/` and `/internship.html` after deploy
