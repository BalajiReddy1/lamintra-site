/**
 * Pulls a component's public signature and its KDoc out of its real Kotlin
 * source, at build time.
 *
 * The alternative was writing the props table by hand, which guarantees it
 * drifts: the site already shipped a wrong component count in five places at
 * once because the number lived in five places. A parameter table is that
 * failure with more surface area. This reads the file the CLI installs, so a
 * table can only be wrong if the source is.
 *
 * This is deliberately NOT a Kotlin parser. It handles the shape this registry
 * actually writes - a single top-level @Composable function with a flat
 * parameter list - and it is depth-aware so that defaults containing commas
 * (`TextStyle(fontSize = 16.sp, lineHeight = 24.sp)`) and function types
 * (`(Boolean) -> Unit`) survive. If a component ever needs more than that, the
 * fix is to widen this, not to hand-write a table beside it.
 */

export interface Param {
  name: string;
  type: string;
  /** Undefined means the parameter is required. */
  defaultValue?: string;
  /** From the KDoc `@param` line, if the source documents it. */
  doc?: string;
}

export interface ParsedComponent {
  /** e.g. LamintraButton */
  functionName: string;
  /** The prose above the function, minus the @param lines. */
  summary: string;
  params: Param[];
}

/** Splits on commas that sit at bracket depth zero. */
function splitTopLevel(input: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = '';
  let inString = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inString) {
      current += ch;
      if (ch === '"' && input[i - 1] !== '\\') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      current += ch;
      continue;
    }
    if (ch === '(' || ch === '<' || ch === '[' || ch === '{') depth++;
    // `->` inside a function type would otherwise read as a closing angle.
    if ((ch === ')' || ch === '>' || ch === ']' || ch === '}') && !(ch === '>' && input[i - 1] === '-')) {
      depth--;
    }
    if (ch === ',' && depth === 0) {
      out.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

/** The KDoc block immediately above a declaration, as raw lines. */
function kdocAbove(source: string, declIndex: number): string[] {
  const before = source.slice(0, declIndex);
  const close = before.lastIndexOf('*/');
  if (close === -1) return [];
  const open = before.lastIndexOf('/**', close);
  if (open === -1) return [];
  // Anything other than annotations between the doc and the declaration means
  // the doc belongs to something else.
  const between = before.slice(close + 2).trim();
  if (between && !between.split('\n').every((l) => l.trim().startsWith('@') || l.trim() === '')) {
    return [];
  }
  return before
    .slice(open + 3, close)
    .split('\n')
    .map((l) => l.replace(/^\s*\* ?/, '').trimEnd());
}

export function parseComponent(source: string, functionName: string): ParsedComponent | null {
  const declRe = new RegExp(`fun\\s+${functionName}\\s*\\(`);
  const match = declRe.exec(source);
  if (!match) return null;

  const open = match.index + match[0].length - 1;
  let depth = 0;
  let close = -1;
  for (let i = open; i < source.length; i++) {
    if (source[i] === '(') depth++;
    else if (source[i] === ')') {
      depth--;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close === -1) return null;

  const doc = kdocAbove(source, match.index);
  const paramDocs = new Map<string, string>();
  const summaryLines: string[] = [];
  let currentTag: string | null = null;

  for (const line of doc) {
    const m = /^@param\s+(\[?)(\w+)\]?\s*(.*)$/.exec(line.trim());
    if (m) {
      currentTag = m[2];
      paramDocs.set(currentTag, m[3].trim());
      continue;
    }
    if (line.trim().startsWith('@')) {
      currentTag = null;
      continue;
    }
    if (currentTag) {
      // Continuation of the previous @param.
      const prev = paramDocs.get(currentTag) ?? '';
      paramDocs.set(currentTag, (prev + ' ' + line.trim()).trim());
    } else {
      summaryLines.push(line);
    }
  }

  const params: Param[] = splitTopLevel(source.slice(open + 1, close))
    .filter(Boolean)
    .map((raw) => {
      const colon = raw.indexOf(':');
      const name = raw.slice(0, colon).trim();
      const rest = raw.slice(colon + 1).trim();
      // The first `=` at depth zero separates type from default.
      let depth2 = 0;
      let eq = -1;
      for (let i = 0; i < rest.length; i++) {
        const ch = rest[i];
        if (ch === '(' || ch === '<' || ch === '[') depth2++;
        else if ((ch === ')' || ch === ']') || (ch === '>' && rest[i - 1] !== '-')) depth2--;
        else if (ch === '=' && depth2 === 0 && rest[i + 1] !== '=') {
          eq = i;
          break;
        }
      }
      const type = (eq === -1 ? rest : rest.slice(0, eq)).trim();
      const defaultValue = eq === -1 ? undefined : rest.slice(eq + 1).trim().replace(/\s+/g, ' ');
      // KDoc link syntax is for an IDE, not for a table cell. `[enabled]`
      // renders as literal brackets in HTML and reads as a typo.
      const doc = paramDocs.get(name)?.replace(/\[([^\]]+)\]/g, '$1');
      return { name, type, defaultValue, doc };
    })
    .filter((p) => p.name && p.type);

  // Markdown emphasis is noise in a table cell; the KDoc uses it for prose.
  const summary = summaryLines
    .join('\n')
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]/g, '$1')
    .split('\n\n')
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');

  return { functionName, summary, params };
}
