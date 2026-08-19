/**
 * Shared facts for the legal pages, in one place so three documents cannot
 * disagree with each other about a date or a contact route.
 *
 * KNOWN GAP, recorded rather than papered over: these pages name no legal
 * entity and no postal address, because neither exists yet. A privacy policy
 * that has to satisfy GDPR Article 13 must identify the data controller and a
 * means of contact. `contactUrl` below is a real, working channel today, which
 * is why it is used instead of inventing a company name or publishing a
 * personal address. See CHECKLIST.md.
 *
 * THE REVISIT TRIGGER HAS ALREADY FIRED. It read "revisit when the project
 * incorporates or the domain is bought, whichever comes first"; the domain was
 * bought on 2026-08-11. What is queued, decided 2026-08-16 and not yet done,
 * is `hello@lamintra.com` via Cloudflare Email Routing, named as the contact
 * here and on all three pages, which closes the Article 13 means-of-contact
 * item. It does NOT close the controller-identity half: that still needs a
 * legal entity, and there is not one.
 */

/** Set by hand when a legal page actually changes, not on every deploy. */
export const lastUpdated = '2026-08-11';

/** A contact route that exists and works today. */
export const contactUrl = 'https://github.com/BalajiReddy1/lamintra/issues';

export const licenceUrl = 'https://github.com/BalajiReddy1/lamintra/blob/master/LICENSE';
