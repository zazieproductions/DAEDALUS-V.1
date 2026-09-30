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
JSX element with a `data-source-loc` attribute so the picker can map DOM nodes
back to files. Its own header comment describes it as infrastructure copied
into generated workspaces by the platform's tooling, not as project code.

## Decision

Remove all three inlined scripts from `index.html`. Replace them with a clean
document: meta description, Open Graph tags, `theme-color`, a `<noscript>`
notice, the font preconnects and the module entry point.

Stop loading `.vite-source-tags.js` from `vite.config.ts`, and untrack it. The
file stays on disk (and is git-ignored), because the hosting platform re-supplies
it and someone may want the preview integration back; it simply no longer
participates in this project's builds.

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
  `git show 4d535f2:index.html` and `git show 4d535f2:.vite-source-tags.js`. It
  is preserved, not destroyed.
- `vite.config.ts` loses a top-level `await` and a dynamic import that, on
  inspection, never resolved anyway — Vite bundles the config to a temporary
  file, so the relative specifier `./.vite-source-tags.js` failed silently and
  the plugin had not been active in dev or in builds. The guarded loader was
  dead code describing behaviour that did not happen.
- `SECURITY.md` can now state truthfully that the application collects nothing.

## Note on the boundary

This is the only change in the professionalisation pass that removes working
third-party behaviour. It is recorded here rather than buried in a commit
message precisely because it is the one that a reviewer might reasonably want
to argue with.
