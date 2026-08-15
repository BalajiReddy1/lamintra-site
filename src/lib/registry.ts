import { parseComponent, type ParsedComponent } from './kotlin';
import { components, type Component } from '../data/registry';

/**
 * Reads the registry snapshot at BUILD time.
 *
 * The sources under src/registry/ are a copy of the real registry, taken from
 * the component repo. They are a copy on purpose: Cloudflare builds this repo
 * alone, so a relative path into a sibling checkout would work locally and
 * break on deploy. The copy is refreshed by the sync command in CLAUDE.md, the
 * same discipline public/live/ already uses.
 *
 * Nothing here runs in the browser. Every page that uses it is static.
 */

const sources = import.meta.glob('../registry/**/*.kt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const manifests = import.meta.glob('../registry/**/component.json', {
  eager: true,
}) as Record<string, { default: Manifest }>;

interface Manifest {
  name: string;
  categories: string[];
  registryPackage: string;
  main: string;
  prefix: string;
  files: string[];
  dependencies: Record<string, string>;
  /**
   * Other registry components the CLI installs alongside this one. Added
   * 2026-08-11 with the shared theme.
   *
   * This has to reach the page. "What lands in your project" is the section a
   * sceptical reader checks hardest, and after the theme landed it was
   * under-stating every component by one file.
   */
  requires?: string[];
}

/** `LamintraTextField` from `text-field`. */
function functionNameFor(slug: string): string {
  return (
    'Lamintra' +
    slug
      .split('-')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join('')
  );
}

export interface ComponentPage extends Component {
  functionName: string;
  parsed: ParsedComponent;
  /** The main source file, verbatim. */
  source: string;
  sourceFile: string;
  manifest: Manifest;
  /** Every file the CLI writes, including the namespaced internals. */
  files: string[];
}

function findSource(slug: string, fileName: string): string {
  const key = Object.keys(sources).find((k) => k.endsWith(`/${slug}/${fileName}`));
  if (!key) {
    // Loud rather than silent: a missing source means the snapshot is stale,
    // and a page that quietly renders an empty props table is worse than a
    // build that stops.
    throw new Error(
      `Registry snapshot is missing ${slug}/${fileName}. Re-run the sync in CLAUDE.md.`
    );
  }
  return sources[key];
}

export function getComponentPage(slug: string): ComponentPage {
  const meta = components.find((c) => c.slug === slug);
  if (!meta) throw new Error(`No component metadata for "${slug}"`);

  const manifestKey = Object.keys(manifests).find((k) => k.endsWith(`/${slug}/component.json`));
  if (!manifestKey) throw new Error(`Registry snapshot is missing ${slug}/component.json`);
  const manifest = manifests[manifestKey].default;

  const functionName = functionNameFor(slug);
  const sourceFile = manifest.main.split('/').pop()!;
  const source = findSource(slug, sourceFile);
  const parsed = parseComponent(source, functionName);

  if (!parsed) {
    throw new Error(
      `Could not find "fun ${functionName}" in ${slug}/${sourceFile}. ` +
        `Either the function was renamed or src/lib/kotlin.ts needs widening.`
    );
  }

  /**
   * Every file the CLI actually writes, which is this component's files PLUS
   * the files of anything it requires.
   *
   * Read out of the required component's own manifest rather than hard-coded,
   * so the day the theme gains a second file this page is right without anyone
   * remembering to come here. A missing requirement throws, for the same reason
   * a missing snapshot throws: a page that silently under-states what lands in
   * someone's project is worse than a failed build.
   */
  const requiredFiles = (manifest.requires ?? []).flatMap((required) => {
    const key = Object.keys(manifests).find((k) => k.endsWith(`/${required}/component.json`));
    if (!key) {
      throw new Error(
        `${slug} requires "${required}", which is not in the registry snapshot. ` +
          `Refresh it with the command in CLAUDE.md.`
      );
    }
    return manifests[key].default.files;
  });

  return {
    ...meta,
    functionName,
    parsed,
    source,
    sourceFile,
    manifest,
    files: [...manifest.files, ...requiredFiles],
  };
}

export function getAllComponentPages(): ComponentPage[] {
  return components.map((c) => getComponentPage(c.slug));
}
