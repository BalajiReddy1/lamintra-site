# Lamintra website

The marketing site and component documentation for **Lamintra**, a copy-paste
UI component registry for Compose Multiplatform.

The components themselves are not in this repository. A CLI copies a
component's Kotlin into your project and rewrites its package to match its new
location, so the file compiles where it lands. There is no Gradle dependency
and no runtime: delete the tool afterwards and your code still builds.

- Components and CLI: [BalajiReddy1/lamintra](https://github.com/BalajiReddy1/lamintra)
- Component sources: [BalajiReddy1/lamintra-registry](https://github.com/BalajiReddy1/lamintra-registry)

## What this repository is

Thirteen static pages built with Astro 7 and deployed as `dist/`. No framework
runtime reaches the browser. The only JavaScript a visitor loads is a colour
scheme toggle, the copy buttons, and the loader for the WebAssembly hero.

```
src/
  pages/          One file per route
  layouts/        The shell every page shares
  data/           Registry, releases, FAQ, legal dates
  lib/            Kotlin parser and registry loader
  registry/       A snapshot of the component sources
  styles/         Design tokens and the full stylesheet
public/
  img/            Component renders, drawn headlessly from real source
  fonts/          Self-hosted woff2
scripts/          Build and verification tooling
```

## Getting started

Requires Node 20 or later.

```bash
npm install
npm run dev
```

The dev server runs on port 4174. To see what actually deploys, build first and
serve `dist/`, because that directory is exactly what the host receives.

```bash
npm run build
npm run preview
```

## Verification

Two checks gate a deploy. Both exit non-zero on a finding, and both exist
because they caught a real defect.

```bash
npm run build && npm run check:links && npm run check:spacing
```

- **`check:links`** resolves every internal link against the built output, so a
  dead route fails the build rather than a visitor.
- **`check:spacing`** finds words glued together in the rendered HTML. Astro
  drops the space when a text line ends and an inline tag opens on the next
  one, which produced "are onthe releases page" and, once, a run-together
  headline. It is invisible in review and obvious to a reader.

## How the content is generated

Three things are derived rather than written by hand, each because the
duplicated version had already shipped a bug.

| What | Source |
|---|---|
| Component counts | the length of one array in `src/data/registry.ts` |
| The FAQ and its structured data | one entry per question in `src/data/faq.ts` |
| Every parameter table | parsed from the real Kotlin at build time |

The parameter tables are the important one. `src/lib/kotlin.ts` reads each
component's actual source, including its documentation comments, so a table
cannot drift from the file the CLI installs. A stale or missing snapshot stops
the build rather than rendering an empty table.

## Other commands

| Command | What it does |
|---|---|
| `npm run og-card` | Renders the social card at 1200x630 from `scripts/og-card.html`, filling in the version, install command and component count from the same data the pages use |
| `npm run optimise:images` | Recompresses the PNGs losslessly, refusing to write any file whose pixels changed |

The component renders in `public/img/` are drawn headlessly from the real
registry sources by a harness in the product repository. They are evidence
rather than decoration, and are never edited by hand. If a render is wrong it
is fixed at the source and redrawn.

## Privacy

The typefaces are self-hosted, so no CDN, font service or tag manager is
contacted. The single third-party request any page makes is a cookieless
analytics script, and it is emitted only once a domain is configured. The site
sets no cookies and stores one value in `localStorage`: the colour scheme you
chose. See `/privacy/` for the full account.

## Licence

MIT. See [LICENSE](LICENSE).
