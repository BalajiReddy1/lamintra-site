/**
 * Writes dist/sitemap.xml, and uncomments the Sitemap: line in dist/robots.txt.
 *
 * A sitemap needs absolute URLs, so this needs the origin. It is deliberately
 * NOT hard-coded: no domain has been bought, and a guessed origin is worse than
 * an obviously missing one. The origin comes from `site` in astro.config.mjs,
 * which is the same value Astro needs for canonical and og:url, so all four
 * land together the day the domain exists.
 *
 * With no `site` set this prints what it is waiting for and exits 0, so it can
 * sit in the build without failing it.
 *
 *   node scripts/sitemap.mjs
 *
 * Written by hand rather than with @astrojs/sitemap because this repo carried
 * no dependencies at all until recently, and forty lines is cheaper than
 * another one to keep current.
 */
import { readFileSync, writeFileSync, existsSync, globSync } from 'node:fs';

const config = readFileSync('astro.config.mjs', 'utf8');
// Matches `site: 'https://example.com'` only when it is not commented out.
const match = config.match(/^\s*site:\s*['"]([^'"]+)['"]/m);

if (!match) {
  console.log('No `site` in astro.config.mjs, so no sitemap was written.');
  console.log('The day the domain is bought, set it there and this emits');
  console.log('sitemap.xml and switches on the Sitemap: line in robots.txt.');
  process.exit(0);
}

const origin = match[1].replace(/\/$/, '');

const urls = globSync('dist/**/index.html')
  .map((f) => f.replace(/\\/g, '/').replace(/^dist/, '').replace(/index\.html$/, ''))
  .map((p) => (p === '' ? '/' : p))
  .sort();

const today = new Date().toISOString().slice(0, 10);

// The home page is the one a crawler should weight above the rest; everything
// else is left at the default rather than inventing a hierarchy Google ignores.
const body = urls
  .map((u) => {
    const priority = u === '/' ? '\n    <priority>1.0</priority>' : '';
    return `  <url>\n    <loc>${origin}${u}</loc>\n    <lastmod>${today}</lastmod>${priority}\n  </url>`;
  })
  .join('\n');

writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
);

if (existsSync('dist/robots.txt')) {
  const robots = readFileSync('dist/robots.txt', 'utf8');
  // Anchored on REPLACE-ME, not on "# Sitemap:". The prose above the
  // placeholder in robots.txt also begins "# Sitemap:", and a looser pattern
  // rewrote that comment line instead and left the real placeholder in place.
  const live = robots.replace(
    /^#\s*Sitemap:\s*https?:\/\/REPLACE-ME\/sitemap\.xml\s*$/m,
    `Sitemap: ${origin}/sitemap.xml`
  );
  if (live === robots) {
    console.log('WARNING: the Sitemap: placeholder in robots.txt was not found.');
  } else {
    writeFileSync('dist/robots.txt', live);
  }
}

console.log(`Wrote dist/sitemap.xml with ${urls.length} URLs at ${origin}`);
