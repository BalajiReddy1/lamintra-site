/**
 * Renders public/img/og-card.png from scripts/og-card.html at 1200x630.
 *
 *   npm run og-card
 *
 * The card is the only image on the site that is NOT a component render, so it
 * is the only one allowed to be generated from a template rather than drawn by
 * the harness. Everything on it that can go stale is filled in from the same
 * data the site renders from:
 *
 *   version  <- currentCli   in src/data/releases.ts
 *   command  <- jarFile      derived from the same
 *   count    <- components[] in src/data/registry.ts
 *
 * It is generated because the hand-made version drifted exactly the way
 * everything hand-made in this repo has drifted: it shipped "5 components"
 * after the sixth landed, and a jar filename that never existed. This is the
 * social card, so it was wrong on every share link, in every Slack unfurl and
 * on every Reddit preview.
 *
 * The values are read out of the TypeScript with regexes rather than by
 * importing it, for the same reason scripts/sitemap.mjs reads astro.config.mjs
 * that way: this repo runs its build scripts on plain Node with no loader, and
 * a mis-read fails loudly below rather than silently rendering a wrong card.
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function must(value, what) {
  if (!value) {
    console.error(`Could not read ${what}. The card was NOT rendered.`);
    process.exit(1);
  }
  return value;
}

const releases = readFileSync('src/data/releases.ts', 'utf8');
const registry = readFileSync('src/data/registry.ts', 'utf8');

const version = must(
  releases.match(/export const currentCli = '([^']+)'/)?.[1],
  'currentCli from src/data/releases.ts'
);
// Mirrors `jarFile` in releases.ts. If that derivation changes, change it here.
const jarFile = `lamintra-${version.replace(/^v/, '')}.jar`;
const command = `java -jar ${jarFile} add button`;

// The count the SITE claims, which is components[].length, not installableCount.
// The card should say what a visitor lands on, and the site under-claims by one
// on purpose while glass-sheet is off it.
const count = must(
  (registry.match(/^\s{4}slug: '/gm) || []).length || null,
  'the component list in src/data/registry.ts'
);

const fontSans = readFileSync('public/fonts/archivo-latin.woff2').toString('base64');
const fontMono = readFileSync('public/fonts/jetbrains-mono-latin.woff2').toString('base64');

const html = readFileSync('scripts/og-card.html', 'utf8')
  .replace('{{FONT_SANS}}', fontSans)
  .replace('{{FONT_MONO}}', fontMono)
  .replace('{{VERSION}}', version)
  .replace('{{COMMAND}}', command)
  .replace('{{COUNT}}', String(count));

if (html.includes('{{')) {
  console.error('A token was left unfilled in the template. Not rendering.');
  process.exit(1);
}

const tmp = join(tmpdir(), `lamintra-og-${Date.now()}.html`);
writeFileSync(tmp, html);

const out = join(process.cwd(), 'public', 'img', 'og-card.png');

try {
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--user-data-dir=${join(tmpdir(), 'lamintra-og-profile')}`,
      '--virtual-time-budget=8000',
      `--screenshot=${out}`,
      '--window-size=1200,630',
      `file:///${tmp.replace(/\\/g, '/')}`,
    ],
    { stdio: 'pipe' }
  );
} catch (e) {
  console.error('Chrome failed. Set CHROME_PATH if it is installed elsewhere.');
  console.error(String(e.stderr || e));
  process.exit(1);
} finally {
  if (existsSync(tmp)) unlinkSync(tmp);
}

console.log(`Rendered ${out}`);
console.log(`  version ${version}`);
console.log(`  command ${command}`);
console.log(`  count   ${count} components`);
console.log('Re-run npm run optimise:images afterwards; the PNG is not compressed yet.');
