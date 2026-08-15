/**
 * Shared facts for the legal pages, in one place so three documents cannot
 * disagree with each other about a date or a contact route.
 *
 * KNOWN GAP, recorded rather than papered over: these pages name no legal
 * entity and no postal address, because neither exists yet. A privacy policy
 * that has to satisfy GDPR Article 13 must identify the data controller and a
 * means of contact. `contactUrl` below is a real, working channel today, which
 * is why it is used instead of inventing a company name or publishing a
 * personal address. Revisit when the project incorporates or the domain is
 * bought, whichever comes first. See CHECKLIST.md.
 */

/** Set by hand when a legal page actually changes, not on every deploy. */
export const lastUpdated = '2026-08-11';

/** A contact route that exists and works today. */
export const contactUrl = 'https://github.com/BalajiReddy1/lamintra/issues';

export const licenceUrl = 'https://github.com/BalajiReddy1/lamintra/blob/master/LICENSE';
