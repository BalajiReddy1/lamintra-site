# Lamintra site

The marketing site and component documentation for Lamintra, built with Astro.

## Read `internal/CLAUDE.md` first

The working rules for this repo, and every planning document, live in
`internal/`. That folder is a **separate private git repository** and is
ignored by this one, because it holds competitor assessments, pricing thinking
and honest notes about what has not been tested. None of that belongs in a
public repo.

Start with `internal/STATE.md`, which is the handoff note for where things
stand, then `internal/CLAUDE.md` for the working rules. The rest:

| File | What it holds |
|---|---|
| `internal/STATE.md` | Where things stand, and the next step. Read first |
| `internal/CLAUDE.md` | Working rules, commands, and the traps that cost real time |
| `internal/PRODUCT.md` | Strategy, audience, brand voice |
| `internal/DESIGN.md` | The visual system and the measurements behind it |
| `internal/TESTING.md` | How to test the product properly, and why each phase exists |
| `internal/CHECKLIST.md` | Open engineering work, and the traps list |
| `internal/LAUNCH.md` | Launch, search, analytics, off-site work |
| `internal/DECISIONS.md` | Settled choices and the triggers that reopen them |
| `internal/ROADMAP.md` | The registry's next components |
| `internal/CROSS-REPO.md` | Contracts shared with the product repo |

If `internal/` is missing, this is a fresh clone of the public repo. The site
builds and runs without it; only the reasoning is absent.

## Running it

```bash
npm install
npm run dev
```

## Before any deploy

```bash
npm run build && npm run check:links && npm run check:spacing
```

Both checks exit non-zero on a finding, and both exist because they caught
something real.
