# 0004 — Vendor telemetry removed from `index.html`

- **Status:** Accepted
- **Date:** 2026-09-08

## Context

The repository originated as an export from a hosted generation platform. That
export baked roughly 660 lines of vendor JavaScript directly into
`index.html` — about 30 kB, against 10 lines of actual application markup:

1. **A session recorder.** Loaded `rrweb` from a CDN and captured full DOM
   mutations, click coordinates, scroll depth, key presses and a sampled cursor
   path into `sessionStorage`, up to 30,000 events over a ten-minute window.
2. **A page-view beacon.** `POST`ed to a third-party analytics endpoint on load,
   with a viewer id persisted in `localStorage`.
3. **An element picker.** ~500 lines implementing click-to-inspect and
   WYSIWYG text editing, driven by `postMessage` from a parent frame.

None of it is referenced by the application. All of it shipped in the
production bundle, ran for every visitor, and was invisible in the diff of any
normal change.

A companion file, `.vite-source-tags.js`, is a Vite plugin that annotates every
JSX element with its source location so the picker can map DOM nodes back to
files. It was already git-ignored while being loaded by `vite.config.ts`.

## Decision

Remove all three inlined scripts from `index.html`. Replace them with a clean
document: meta description, Open Graph tags, `theme-color`, a `<noscript>`
notice, the font preconnects and the module entry point.

Keep the optional loader for `.vite-source-tags.js` in `vite.config.ts`, guarded
so a missing file degrades silently — the normal case for a fresh clone.

## Rationale

- **Privacy.** A public repository should not record its visitors' sessions and
  send them to a third party. That is true regardless of intent, and it is not
  disclosed anywhere a visitor would see.
- **Correctness of the artefact.** The repository is presented as the author's
  work. Vendor instrumentation is not, and its presence makes the codebase
  harder to read and to trust.
- **Weight.** `index.html` went from 30 kB to 1.7 kB — a ~94% reduction in the
  entry document, on the critical path for every visitor.
- **Reviewability.** Nothing in an application's HTML should be un-auditable
  minified code that no commit message explains.

## Consequences

- Click-to-inspect and in-place text editing no longer work when the app is
  previewed inside that platform's editor. Local development, the production
  build and every deployment target are unaffected.
- Anyone who wants the picker back can recover it from git history:
  `git show 4d535f2:index.html`. It is preserved, not destroyed.
- `SECURITY.md` can now state truthfully that the application collects nothing.

## Note on the boundary

This is the only change in the professionalisation pass that removes working
third-party behaviour. It is recorded here rather than buried in a commit
message precisely because it is the one that a reviewer might reasonably want
to argue with.
