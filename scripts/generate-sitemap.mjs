#!/usr/bin/env node
/**
 * Generates sitemap.xml and robots.txt from seo/site.json + HTML files in publish root.
 * Validates SEO meta tags on every root HTML page before writing output.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const CONFIG_PATH = join(ROOT, "seo", "site.json");
const FORBIDDEN_DOMAIN = "zas.tech";

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

/** @type {string[]} */
const seoIssues = [];

for (const file of htmlInRoot) {
  const html = readFileSync(join(ROOT, file), "utf8");
  const meta = pagesConfig[file];
  const expectedCanonical =
    meta?.path === "/" ? `${siteUrl}/` : meta ? `${siteUrl}${meta.path}` : null;

  if (html.includes(FORBIDDEN_DOMAIN)) {
    seoIssues.push(`${file}: contains forbidden domain "${FORBIDDEN_DOMAIN}"`);
  }
  if (!/<title[^>]*>[\s\S]+?<\/title>/i.test(html)) {
    seoIssues.push(`${file}: missing <title>`);
  }
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) {
    seoIssues.push(`${file}: missing meta description`);
  }
  if (!/<link\s+rel="canonical"\s+href="[^"]+"/i.test(html)) {
    seoIssues.push(`${file}: missing canonical link`);
  } else if (expectedCanonical) {
    const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (match && match[1] !== expectedCanonical) {
      seoIssues.push(`${file}: canonical mismatch (got ${match[1]}, expected ${expectedCanonical})`);
    }
  }
  for (const tag of ["og:title", "og:description", "og:url", "og:image", "og:type"]) {
    if (!html.includes(`property="${tag}"`)) {
      seoIssues.push(`${file}: missing Open Graph tag ${tag}`);
    }
  }
  for (const tag of ["twitter:card", "twitter:title", "twitter:description"]) {
    if (!html.includes(`name="${tag}"`)) {
      seoIssues.push(`${file}: missing Twitter Card tag ${tag}`);
    }
  }
}

if (seoIssues.length) {
  console.error("[seo] Validation failed:\n" + seoIssues.map((i) => `  - ${i}`).join("\n"));
  process.exit(1);
}

/** @type {{ loc: string; changefreq: string; priority: number; lastmod: string; file: string }[]} */
const urls = [];
/** @type {{ loc: string; reason: string }[]} */
const excluded = [];

for (const [file, meta] of Object.entries(pagesConfig)) {
  if (exclude.has(file)) {
    excluded.push({ loc: `${siteUrl}${meta.path === "/" ? "/" : meta.path}`, reason: "excludeFromSitemap" });
    continue;
  }
  const filePath = join(ROOT, file);
  if (!existsSync(filePath)) {
    console.warn(`[seo] Configured page missing on disk: ${file}`);
    continue;
  }
  const loc = `${siteUrl}${meta.path === "/" ? "/" : meta.path}`;
  if (meta.robots?.includes("noindex")) {
    excluded.push({ loc, reason: "noindex (confirmation page — not for search indexing)" });
    continue;
  }

  const lastmod = statSync(filePath).mtime.toISOString().slice(0, 10);

  urls.push({
    loc,
    changefreq: meta.changefreq || defaults.changefreq,
    priority: meta.priority ?? defaults.priority,
    lastmod,
    file,
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
console.log(`[seo] Robots:  ${siteUrl}/robots.txt`);
console.log("\n[seo] Pages in sitemap:");
for (const u of urls) {
  console.log(`  • ${u.loc}  (priority ${u.priority.toFixed(1)}, lastmod ${u.lastmod})`);
}
if (excluded.length) {
  console.log("\n[seo] Excluded from sitemap (still public, not for indexing):");
  for (const e of excluded) {
    console.log(`  • ${e.loc}  — ${e.reason}`);
  }
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
