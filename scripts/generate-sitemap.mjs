#!/usr/bin/env node
/**
 * Generates sitemap.xml and robots.txt from seo/site.json + HTML files in publish root.
 * Run on every Netlify deploy so new pages are picked up automatically.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const CONFIG_PATH = join(ROOT, "seo", "site.json");

const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
const siteUrl = config.siteUrl.replace(/\/$/, "");
const pagesConfig = { ...config.pages };
const defaults = config.defaults || { changefreq: "monthly", priority: 0.5 };
const exclude = new Set(config.excludeFromSitemap || []);

const htmlInRoot = readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const known = new Set(Object.keys(pagesConfig));

for (const file of htmlInRoot) {
  if (!known.has(file) && !exclude.has(file)) {
    console.warn(
      `[seo] New page "${file}" — add it to seo/site.json for title/description/priority. Using defaults.`,
    );
    pagesConfig[file] = {
      path: file === "index.html" ? "/" : `/${file}`,
      changefreq: defaults.changefreq,
      priority: defaults.priority,
      title: "ZAS Tech",
      description: config.organization.description,
      ogImage: `${siteUrl}/assets/logo.JPG`,
    };
  }
}

/** @type {{ loc: string; changefreq: string; priority: number; lastmod: string }[]} */
const urls = [];

for (const [file, meta] of Object.entries(pagesConfig)) {
  if (exclude.has(file)) continue;
  const filePath = join(ROOT, file);
  if (!existsSync(filePath)) {
    console.warn(`[seo] Configured page missing on disk: ${file}`);
    continue;
  }
  if (meta.robots?.includes("noindex")) continue;

  const lastmod = statSync(filePath).mtime.toISOString().slice(0, 10);

  urls.push({
    loc: `${siteUrl}${meta.path === "/" ? "/" : meta.path}`,
    changefreq: meta.changefreq || defaults.changefreq,
    priority: meta.priority ?? defaults.priority,
    lastmod,
  });
}

urls.sort((a, b) => b.priority - a.priority);

const urlEntries = urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(join(ROOT, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(ROOT, "robots.txt"), robots, "utf8");

console.log(`[seo] Wrote sitemap.xml (${urls.length} URLs) and robots.txt`);
console.log(`[seo] Sitemap: ${siteUrl}/sitemap.xml`);

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
