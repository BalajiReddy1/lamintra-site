/**
 * Release history, taken from the repository's own tags.
 *
 * Every `summary` here is the tag's subject line verbatim. Nothing is
 * paraphrased and nothing is invented: this project has no changelog file, so
 * the tags ARE the record, and rewriting them into nicer marketing sentences
 * would make this page the least trustworthy thing on the site.
 *
 * Refresh with:
 *   git for-each-ref --sort=-creatordate \
 *     --format='%(refname:short)|%(creatordate:short)|%(contents:subject)' refs/tags
 */
export interface Release {
  version: string;
  date: string;
  summary: string;
}

export const cliReleases: Release[] = [
  // The tag subject is "v0.6.0: ios-shell scaffold, registry v0.5.3". The
  // leading version is dropped here and ONLY here, because the page already
  // renders the version in its own column and would otherwise read
  // "v0.6.0 - v0.6.0: ...". Noted rather than done quietly: the rule above is
  // that summaries are verbatim, and the next tag should just not repeat its
  // own version in the subject.
  { version: 'v0.6.1', date: '2026-08-16', summary: 'registry v0.5.4, ios-shell without material3' },
  { version: 'v0.6.0', date: '2026-08-16', summary: 'ios-shell scaffold, registry v0.5.3' },
  { version: 'v0.5.0', date: '2026-08-06', summary: 'Wave 1: flat slugs, new base-tier language, retire the neon fixtures' },
  { version: 'v0.4.0', date: '2026-08-06', summary: 'Ship the rename: registry v0.4.0, CLI v0.4.0' },
  { version: 'v0.3.3', date: '2026-08-05', summary: 'Fix 11 token deviations; release CLI 0.3.3 against registry v0.3.2' },
  { version: 'v0.3.2', date: '2026-08-01', summary: 'Window insets for bottom sheet; harden installer against path traversal' },
  { version: 'v0.3.1', date: '2026-07-30', summary: 'Preview-on-install' },
  { version: 'v0.3.0', date: '2026-07-20', summary: 'init auto-detection, and an add idempotency guard' },
  { version: 'v0.2.1', date: '2026-07-20', summary: 'Fix bottom sheet drag-to-dismiss' },
  { version: 'v0.2.0', date: '2026-07-12', summary: 'Add the button and neon-outline components' },
  { version: 'v0.1.0', date: '2026-07-12', summary: 'Initial public release' },
];

/**
 * The registry the CLI is pinned to. Read out of `Registry.kt`, where
 * REGISTRY_BASE points at a release TAG rather than at `main`, so an install
 * cannot be changed under a user by a push to the registry.
 *
 * (It lived in `Installer.kt` until 2026-08-16, when the transport moved so
 * that `add` and `scaffold` could share it.)
 */
export const currentCli = 'v0.6.1';
export const pinnedRegistry = 'v0.5.4';

/**
 * The downloaded file's real name, which is NOT `lamintra.jar`.
 *
 * `archiveVersion` in cli-kotlin/build.gradle.kts puts the version in the
 * filename, and release.yml uploads that file as-is, so what a visitor gets
 * from the release page is `lamintra-0.6.1.jar`. The site said
 * `java -jar lamintra.jar` in six hand-written places, so the first command
 * every new user copied failed with "Unable to access jarfile". The founder
 * hit it on the first real install test on 2026-08-11.
 *
 * Derived here rather than typed anywhere, for the same reason the component
 * counts are: six copies of a string that changes every release is six chances
 * to ship a broken primary CTA, and it was already wrong in all six.
 *
 * If the jar is ever renamed on the release side, this is the only line to
 * change.
 */
export const jarFile = `lamintra-${currentCli.replace(/^v/, '')}.jar`;

/** The full command, so callers never concatenate `java -jar` themselves. */
export const jarCommand = (args: string) => `java -jar ${jarFile} ${args}`;
