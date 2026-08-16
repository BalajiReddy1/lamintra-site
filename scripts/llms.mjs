/**
 * Writes dist/llms.txt as a postbuild step.
 *
 * WHAT IT IS. A markdown index of the site aimed at a language model reading it
 * rather than a crawler ranking it. Same idea as sitemap.xml, different reader.
 *
 * WHY IT IS WORTH TWENTY MINUTES AND NOT MORE THAN THAT. The evidence for
 * payoff is weak and worth writing down rather than discovering later: adoption
 * sits near 10% of sampled domains, AI crawlers overwhelmingly fetch the HTML
 * and skip this file (one measured domain saw 84 of 62,100 bot requests hit
 * it), and Google has said on the record that it does not support it and does
 * not plan to. No major model provider has committed to reading it in
 * production.
 *
 * It is here anyway for two honest reasons. It costs one generated file on a
 * site whose content is already structured data, and developer-tool
 * documentation is the one category where the format has real adoption -
 * Anthropic and Cloudflare both publish one. If it turns out to matter, it is
 * already there; if it does not, it cost a script.
 *
 * GENERATED, never hand-written, for the same reason the component counts are:
 * a hand-kept second index of a site is a second thing to forget.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

/** Pull the exported arrays out of the TS sources without a TS toolchain. */
function readSource(file) {
  return readFileSync(resolve(root, 'src/data', file), 'utf8');
}

const registry = readSource('registry.ts');
const releases = readSource('releases.ts');

// Both quote styles. The first version of this matched single quotes only and
// silently dropped `text-field`, whose blurb is double-quoted because it
// contains an apostrophe: seven components indexed out of eight, and the file
// looked completely fine.
const q = String.raw`(?:'([^']*)'|"([^"]*)")`;
const components = [
  ...registry.matchAll(
    new RegExp(String.raw`slug:\s*${q},\s*\n\s*name:\s*${q},\s*\n\s*blurb:\s*${q}`, 'g')
  ),
].map((m) => ({
  slug: m[1] ?? m[2],
  name: m[3] ?? m[4],
  blurb: m[5] ?? m[6],
}));

const currentCli = releases.match(/currentCli\s*=\s*'([^']+)'/)?.[1] ?? '';
const pinnedRegistry = releases.match(/pinnedRegistry\s*=\s*'([^']+)'/)?.[1] ?? '';
const declared = Number(registry.match(/installableCount\s*=\s*(\d+)/)?.[1] ?? NaN);

// Cross-checked against the count the site itself renders, not just against
// zero. A partial parse is the failure that actually happened here, and a
// "did we get any at all" guard waves it straight through.
if (components.length !== declared || !currentCli) {
  throw new Error(
    `llms.txt: parsed ${components.length} components but registry.ts declares ` +
      `installableCount ${declared}, currentCli "${currentCli}". The shape of ` +
      'registry.ts or releases.ts changed - fix this script rather than shipping ' +
      'an index that disagrees with the site.'
  );
}

const site = 'https://lamintra.com';

const out = `# Lamintra

> Copy-paste UI components for Compose Multiplatform. A CLI copies a component
> into your Kotlin project and rewrites its package to match its destination, so
> the file compiles where it lands. No Gradle dependency and no runtime.

Components are not Material. They are written on compose.foundation only and run
on Android, iOS, desktop and web from one source file. Every render on the site
is drawn headlessly by the same harness that verifies the components, from the
same Kotlin the CLI installs.

Current CLI: ${currentCli}. Pinned registry tag: ${pinnedRegistry}. The CLI pins
a registry tag rather than a branch, so a registry push cannot change what an
existing install gets.

## Start here

- [Install](${site}/install/): the two commands, plus the optional iOS shell scaffold
- [Components](${site}/components/): all ${components.length}, with props parsed from the real Kotlin
- [Changelog](${site}/changelog/): releases, and what has been retired and why

## Components

${components.map((c) => `- [${c.name}](${site}/components/${c.slug}/): \`add ${c.slug}\`. ${c.blurb}`).join('\n')}

## Legal and data handling

- [Privacy](${site}/privacy/): one localStorage key, no cookies, no accounts
- [Terms](${site}/terms/)
- [Compliance](${site}/compliance/): what has been measured, and what has not

## Source

- CLI and components: https://github.com/BalajiReddy1/lamintra
- Registry the CLI fetches from: https://github.com/BalajiReddy1/lamintra-registry
- This website: https://github.com/BalajiReddy1/lamintra-site
`;

writeFileSync(resolve(root, 'dist/llms.txt'), out, 'utf8');
console.log(`Wrote dist/llms.txt with ${components.length} components at ${site}`);
