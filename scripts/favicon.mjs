/**
 * Renders public/favicon.ico from public/favicon.svg.
 *
 *   npm run favicon
 *
 * The SVG is the artwork and the only hand-authored file; the ICO is derived,
 * for the same reason the OG card is generated rather than drawn. The mark has
 * already been redrawn once (commit c5a8f5f), and a hand-exported raster that
 * nobody remembers to re-export is how this repo has been bitten before.
 *
 * Why an ICO exists at all, when the SVG is what modern browsers use:
 * /favicon.ico is the path a browser requests on its own when it finds no
 * usable <link>, and it is the fallback for anything that will not take an
 * SVG. It is cheap insurance on the one asset whose whole job is to render
 * somewhere this code is not watching.
 *
 * Rendered through headless Chrome because Pillow does not rasterise SVG, and
 * Chrome is already this repo's renderer for the OG card. Transparent
 * background, because the chip's own rounded corners must not sit on a white
 * square - that is exactly what a favicon on a dark tab strip would expose.
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const SIZE = 512;

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_PATH.`);
  process.exit(1);
}

const svg = readFileSync('public/favicon.svg', 'utf8');

// The SVG is 32x32 in user units. Scaled up here rather than edited, so the
// artwork file stays the thing the <link> actually serves.
const html = `<!doctype html><meta charset="utf-8">
<style>
  html,body { margin:0; padding:0; background:transparent; }
  svg { display:block; width:${SIZE}px; height:${SIZE}px; }
</style>
${svg}`;

const tmp = join(tmpdir(), 'lamintra-favicon.html');
const png = join(tmpdir(), 'lamintra-favicon.png');
writeFileSync(tmp, html);

execFileSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--default-background-color=00000000',
    `--user-data-dir=${join(tmpdir(), 'lamintra-favicon-profile')}`,
    '--virtual-time-budget=8000',
    `--screenshot=${png}`,
    `--window-size=${SIZE},${SIZE}`,
    pathToFileURL(tmp).href,
  ],
  { stdio: 'ignore' }
);

if (!existsSync(png)) {
  console.error('Chrome produced no PNG. The ICO was NOT written.');
  process.exit(1);
}

// 16, 32 and 48 in one file. Google asks for at least 8x8 and recommends
// larger than 48; the SVG covers every size that can take it, so the ICO only
// has to cover the small fallbacks.
execFileSync(
  'python',
  [
    '-c',
    [
      'import sys',
      'from PIL import Image',
      'im = Image.open(sys.argv[1]).convert("RGBA")',
      'im.save(sys.argv[2], sizes=[(16,16),(32,32),(48,48)])',
    ].join('\n'),
    png,
    'public/favicon.ico',
  ],
  { stdio: 'inherit' }
);

unlinkSync(tmp);
unlinkSync(png);
console.log('Rendered public/favicon.ico from public/favicon.svg (16, 32, 48).');
