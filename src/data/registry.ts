/**
 * The registry, as data rather than as markup.
 *
 * This is the reason for the build step. The old page hard-coded each
 * component into the gallery, into the count in three places, into the FAQ
 * answer and into the FAQ's JSON-LD twin - six edits to ship one component,
 * and the count was wrong in five of them the day `segmented` landed.
 *
 * `renderWidth` / `renderHeight` are the specimen's own dimensions, and they
 * MUST match what the harness writes. A wrong pair reserves the wrong space
 * and the page shifts as the image loads. Re-check them after any change to
 * RenderSpecimens.kt.
 */
export interface Component {
  slug: string;
  name: string;
  /** One line, in the product's voice: what it is, not what it is like. */
  blurb: string;
  renderWidth: number;
  renderHeight: number;
  /** The tier is a real distinction in the product, not a label. */
  tier: 'base' | 'signature';
}

export const components: Component[] = [
  {
    slug: 'button',
    name: 'Button',
    blurb: 'Four kinds and two sizes from one file. Emphasis is a parameter, not four components.',
    renderWidth: 380,
    renderHeight: 300,
    tier: 'base',
  },
  {
    slug: 'card',
    name: 'Card',
    blurb: 'Groups content, or takes an onClick and presses on a spring. Both from the same file.',
    renderWidth: 380,
    renderHeight: 230,
    tier: 'base',
  },
  {
    slug: 'text-field',
    name: 'Text field',
    blurb: "Focus thickens and darkens the field's own contour, on a spring rather than a curve.",
    renderWidth: 380,
    renderHeight: 250,
    tier: 'base',
  },
  {
    slug: 'list-row',
    name: 'List row',
    blurb: 'A row inside a card is a region of a surface, so at rest it draws nothing.',
    renderWidth: 380,
    renderHeight: 260,
    tier: 'base',
  },
  {
    slug: 'switch',
    name: 'Switch',
    blurb: 'Knob position carries on and off, so it still reads in a greyscale screenshot.',
    renderWidth: 380,
    renderHeight: 100,
    tier: 'base',
  },
  {
    slug: 'segmented',
    name: 'Segmented',
    blurb: 'One choice out of a few. The thumb slides between segments rather than cutting.',
    renderWidth: 380,
    renderHeight: 212,
    tier: 'base',
  },
];

/**
 * What the CLI can install.
 *
 * Equal to `components.length` since 2026-08-11, when `glass-sheet` was retired
 * from the registry. Before that the registry shipped seven and the site showed
 * six, and the gap was described on two pages as under-claiming by one. It was
 * really the reverse: a component that had been judged as not fitting the
 * design language was still installable, so the site was under-claiming while
 * the product was over-shipping.
 *
 * This is kept as a separate export rather than deleted, because the two
 * numbers are separate facts that happen to be equal today. If a component is
 * ever added to the registry before its doc page exists, this is the honest
 * place to say so.
 */
export const installableCount = 6;
