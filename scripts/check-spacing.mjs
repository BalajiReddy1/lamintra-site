/**
 * Catches the whitespace bug Astro templates invite: a text line ending in a
 * word, an inline tag opening on the next line, and the space between them
 * silently dropped. It renders as "are onthe releases page" and
 * "covers whatinit", and it has now shipped three separate times here.
 *
 * This reads the BUILT html rather than the source, because the source form is
 * only a hint: the question that matters is whether the rendered text has a
 * word running into the next one. Run it after `npm run build`.
 *
 *   node scripts/check-spacing.mjs
 *
 * Exits non-zero when it finds one, so it can gate a deploy.
 */
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = globSync('dist/**/*.html');

// A lowercase word, an inline tag with any attributes, then a letter. The tag
// is matched non-greedily to its own closing bracket so attributes are allowed.
const RUN_IN = /([a-z]{2,})<(code|a|b|strong|em|span)(?:\s[^>]*)?>([a-zA-Z])/g;
// The mirror: an inline tag closing straight into a word.
const RUN_OUT = /<\/(code|a|b|strong|em|span)>([a-zA-Z])/g;

let found = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const re of [RUN_IN, RUN_OUT]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html)) !== null) {
      const at = Math.max(0, m.index - 40);
      const context = html.slice(at, m.index + m[0].length + 25).replace(/\s+/g, ' ');
      console.log(`${file.replace(/\\/g, '/')}\n   ${context}\n`);
      found++;
    }
  }
}

if (found > 0) {
  console.log(`${found} run-together word(s). Put the space back with {' '}.`);
  process.exit(1);
}
console.log(`No run-together words in ${files.length} built pages.`);
