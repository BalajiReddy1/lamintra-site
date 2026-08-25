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
export const currentCli = 'v0.10.0';
export const pinnedRegistry = 'v0.9.0';

/**
 * The downloaded file's name, and it is deliberately unversioned.
 *
 * This line has now been wrong in both directions, so both are recorded.
 *
 * Until 2026-08-11 the site said `lamintra.jar` in six hand-written places
 * while the release served `lamintra-0.8.0.jar`, because `archiveVersion` in
 * cli-kotlin/build.gradle.kts puts the version in the built filename and
 * release.yml uploaded that file as-is. So the first command every new user
 * copied failed with "Unable to access jarfile". The founder hit it on the
 * first real install test.
 *
 * The fix was to derive the versioned name here. That closed the mismatch and
 * left a worse one: the version was baked into every command anyone wrote
 * down. A demo video, a forum post, a team's onboarding doc - all of them
 * break the day the next tag ships, and none of them can be regenerated from
 * this file the way these pages can.
 *
 * So release.yml uploads the same jar under two names as of 2026-08-25.
 * `lamintra-<version>.jar` still exists, still carries the tag assertion, and
 * is what anyone pinning a version should use. `lamintra.jar` is what the
 * site hands out. The unversioned name is also the only thing that makes
 * `releases/latest/download/lamintra.jar` resolve, because that URL matches
 * on asset name and a versioned one can never be "latest".
 *
 * Still derived rather than typed in each page, for the same reason the
 * component counts are.
 */
export const jarFile = 'lamintra.jar';

/** The full command, so callers never concatenate `java -jar` themselves. */
export const jarCommand = (args: string) => `java -jar ${jarFile} ${args}`;
