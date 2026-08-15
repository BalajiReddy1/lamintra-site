// @ts-check
import { defineConfig } from 'astro/config';

// The migration runs side by side rather than in place.
//
// `publicDir` is the EXISTING public/ folder, so the new pages share the one
// copy of img/ and live/ instead of duplicating 11MB of wasm. That folder also
// still holds the shipped index.html and styles.css, which Astro copies through
// untouched: the working site stays reachable at / for as long as the migration
// takes, and the new pages build under /v2/ beside it.
//
// The cutover is a single step at the end - delete public/index.html, move the
// v2 pages up a level - and until then nothing that currently works can break.
export default defineConfig({
  publicDir: './public',
  outDir: './dist',
  srcDir: './src',
  build: {
    // Emit /v2/index.html rather than /v2.html, so the dev server and the built
    // output agree about what a directory URL means. Cloudflare Pages serves
    // both, but the two behaving differently in local preview is a class of bug
    // nobody enjoys finding after deploy.
    format: 'directory',
  },
  // Bought 2026-08-11. This one line is load-bearing for five separate things,
  // all of which were built and tested against both states before the domain
  // existed: canonical URLs, og:url, an absolute og:image, sitemap.xml (written
  // by scripts/sitemap.mjs as a postbuild step, which also uncomments the
  // Sitemap: line in robots.txt), and the analytics script, whose data-domain
  // is this hostname and which is not emitted at all without it.
  //
  // No trailing slash. Astro joins paths onto this and a trailing slash
  // produces "https://lamintra.com//install/" in the canonical tag.
  site: 'https://lamintra.com',
});
