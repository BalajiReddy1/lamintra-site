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
export const currentCli = 'v0.9.0';
export const pinnedRegistry = 'v0.8.0';

/**
 * The downloaded file's real name, which is NOT `lamintra.jar`.
 *
 * `archiveVersion` in cli-kotlin/build.gradle.kts puts the version in the
 * filename, and release.yml uploads that file as-is, so what a visitor gets
 * from the release page is `lamintra-0.8.0.jar`. The site said
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
