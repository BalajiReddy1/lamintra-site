/**
 * Every internal link in the built site, resolved against the built output.
 *
 * CHECKLIST.md has wanted this as a standing check for a while: it is cheap,
 * and it makes a dead nav link loud instead of silent. A 404 on a static host
 * is not an error anyone sees until a visitor does.
 *
 *   node scripts/check-links.mjs
 *
 * Exits non-zero on a broken link, so it can gate a deploy.
 */
import { readFileSync, existsSync, globSync } from 'node:fs';

const files = globSync('dist/**/*.html');
const broken = [];
let checked = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const from = file.replace(/\\/g, '/').replace(/^dist/, '').replace(/index\.html$/, '') || '/';

  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const raw = m[1].split('#')[0].split('?')[0];
    if (!raw) continue;
    checked++;

    // A directory URL is served by its index.html; a file URL is itself.
    const candidates = raw.endsWith('/')
      ? [`dist${raw}index.html`]
      : [`dist${raw}`, `dist${raw}/index.html`];

    if (!candidates.some((c) => existsSync(c))) {
      broken.push({ from, to: raw });
    }
  }
}

if (broken.length > 0) {
  for (const b of broken) console.log(`BROKEN  ${b.from}  ->  ${b.to}`);
  console.log(`\n${broken.length} broken of ${checked} internal links.`);
  process.exit(1);
}
console.log(`All ${checked} internal links resolve, across ${files.length} pages.`);
