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
  // No site url yet. Astro uses it for canonical, sitemap and absolute og:image,
  // and all three are already blocked on the domain in CHECKLIST.md. A guessed
  // origin is worse than an obviously missing one, so this stays out until the
  // domain is bought and then all four land in one pass.
  // site: 'https://lamintra.com',
});
