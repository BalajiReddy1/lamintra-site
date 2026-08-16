/**
 * The questions a sceptical developer actually asks, and the answers, ONCE.
 *
 * This file exists because of a recorded failure. The old page kept the FAQ in
 * two places - the visible markup and a FAQPage JSON-LD block - and two of the
 * four answers were written from memory of the page rather than copied from
 * it, so they diverged mid-sentence. Google requires the marked-up text to
 * appear on the page; a paraphrase is a violation.
 *
 * The page and the structured data now render from these strings, so they
 * cannot disagree. Do not reintroduce a second copy to "format it nicer".
 *
 * The component count is interpolated for exactly the same reason, and this
 * file got it wrong anyway: it said "six components today" while the site said
 * eight, on a page whose whole argument is that its claims are checkable. A
 * count typed into prose is a count that goes stale the next time one ships.
 */
import { components } from './registry';

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: 'Can I use this alongside Material 3?',
    answer:
      "Yes. The components import compose.foundation only and never touch Material, so there is nothing to conflict. Their names are prefixed, so LamintraButton and Material's Button can sit in the same file.",
  },
  {
    question: 'What happens when Compose updates and something breaks?',
    answer:
      'The code is in your repository, so you fix it the same way you fix any other file you own, on your schedule. There is no version of ours to wait for and nothing to unblock you. That is the honest trade: you take on maintenance in exchange for never being blocked by a maintainer.',
  },
  {
    question: 'Does it work on iOS, really?',
    answer:
      'Every component compiles for Android, iOS, desktop and web, and the interaction tests run on a real iOS simulator in CI, not just on a desktop machine. Nothing uses a platform-specific drawing API, which is why the switch shadow is drawn as fading strokes rather than Modifier.shadow, whose coloured variants are Android only. What is not verified on iOS is appearance. Composition and behaviour are tested; nobody has photographed them on a device.',
  },
  {
    question: 'Is it free, and what is the catch?',
    answer:
      `Free, no account, nothing tracked. Released under the MIT licence, so what you install is yours to ship commercially and to keep whatever happens upstream. The honest catch is the size of the library: there are ${components.length} components today, and the next ones get chosen by whoever asks first.`,
  },
];

/** The FAQPage block, built from the same strings the page renders. */
export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
