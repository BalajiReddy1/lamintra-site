/**
 * Shared facts for the legal pages, in one place so three documents cannot
 * disagree with each other about a date or a contact route.
 *
 * KNOWN GAP, recorded rather than papered over: these pages name no legal
 * entity and no postal address, because neither exists yet. A privacy policy
 * that has to satisfy GDPR Article 13 must identify the data controller and a
 * means of contact. `contactEmail` below closes the means-of-contact half,
 * live via Cloudflare Email Routing since 2026-08-24. It does NOT close the
 * controller-identity half: that still needs a legal entity, and there is not
 * one. See CHECKLIST.md.
 */

/** Set by hand when a legal page actually changes, not on every deploy. */
export const lastUpdated = '2026-08-24';

/** A real inbox, live since 2026-08-24. The means-of-contact half of Article 13. */
export const contactEmail = 'hello@lamintra.com';

/** Public and permanent, kept alongside the email for anyone who prefers it. */
export const contactUrl = 'https://github.com/BalajiReddy1/lamintra/issues';

export const licenceUrl = 'https://github.com/BalajiReddy1/lamintra/blob/master/LICENSE';
