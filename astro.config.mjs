// @ts-check
import { defineConfig } from 'astro/config';

// `publicDir` is copied through untouched, and it holds live/, the 11MB wasm
// bundle the hero loads. `outDir` is dist/, which is exactly what Cloudflare
// gets: it is uploaded directly rather than built from Git, because live/ is
// gitignored and a Git-connected build would produce a dist/ without it. The
// hero would then fall back to the static PNG silently and by design.
//
// This comment described a side-by-side migration under /v2/ until the cutover
// completed on 2026-08-11. There is no /v2/ prefix and no hand-written page
// now; the retired one is in legacy/, which sits outside publicDir.
export default defineConfig({
  publicDir: './public',
  outDir: './dist',
  srcDir: './src',
  build: {
    // Emit /install/index.html rather than /install.html, so the dev server and
    // the built output agree about what a directory URL means. Cloudflare Pages
    // serves both, but the two behaving differently in local preview is a class
    // of bug nobody enjoys finding after deploy.
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
