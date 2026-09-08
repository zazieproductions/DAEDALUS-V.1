# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The in-fiction version reported by the interface (`v7.3.1`, kernel
`nous-4.2.0`) is part of the work and does not track this file.

## [Unreleased]

Nothing yet.

## [1.0.0] — 2026-09-08

First maintained release. The application's behaviour is preserved from the
original export; everything around it — structure, types, tests, tooling,
documentation — was rebuilt.

### Added

**Architecture**

- `src/config/window-manifest.ts`: every window declared once as data (id,
  title, summary, icon, accent, default geometry, initial docked state). Dock
  order is manifest order. See
  [ADR 0001](docs/decisions/0001-registry-driven-window-system.md).
- `src/config/windows.ts`: the manifest bound to components, kept separate so
  the manifest never imports React components.
- `src/config/env.ts`: typed, validated, single-point access to the three
  supported environment variables. No component reads `import.meta.env`.
- `src/config/theme.ts` and `src/config/metrics.ts`: design tokens and
  telemetry parameters as named constants.
- `src/lib/simulations/`: the force-directed graph and synapse field extracted
  as pure functions with injectable randomness.
  [ADR 0003](docs/decisions/0003-pure-simulations-separate-from-rendering.md).
- `src/features/terminal/commands.ts`: the shell as a registry of pure
  functions with a generated `help` and in-band fault reporting.
- `src/data/`: ~100 authored fragments moved out of components and the store
  into ten typed corpus modules.
  [ADR 0005](docs/decisions/0005-corpus-as-data-modules.md).
- `src/hooks/useAnimationCanvas.ts`: one frame loop with DPR scaling,
  seconds-based timing and a reduced-motion path.
- `@/*` path alias in both TypeScript and Vite; no relative parent imports
  remain.

**Quality tooling** (none of this existed before)

- Vitest with jsdom, Testing Library and V8 coverage — **100 tests** across
  seven unit suites and one integration suite.
- ESLint 9 flat config (typescript-eslint, react-hooks, react-refresh,
  eslint-config-prettier) and Prettier with a shared `.prettierrc.json`.
- Project-referenced TypeScript (`app`, `node`, `test`) under `tsc -b`, strict,
  with `noUnusedLocals`, `noUnusedParameters` and
  `noFallthroughCasesInSwitch`.
- `npm run validate` — format → lint → typecheck → test → build, the exact
  sequence CI runs.
- GitHub Actions CI on push and pull request; manual-dispatch GitHub Pages
  deployment.
- `tools/generate-layout-diagram.mjs` (`npm run docs:diagram`) renders
  `docs/media/desktop-layout.svg` from the manifest; CI fails if the committed
  SVG is stale.
- `tools/clean.mjs` (`npm run clean`), `.nvmrc`, `.editorconfig`, VS Code
  workspace recommendations.

**Documentation**

- A rewritten `README.md`, and a `docs/` set covering architecture, the window
  system, the simulations, the terminal, creative methodology, development,
  deployment, troubleshooting and the roadmap.
- Five architecture decision records in `docs/decisions/`.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE` (MIT),
  issue templates and a pull request template.

**Features and behaviour**

- Maximise and restore, which were previously non-functional controls.
- Double-clicking a title bar toggles maximise.
- Window position clamping (`clampWindowPosition`): at least 96 px of grab area
  always stays on screen, and windows never sit under the top bar.
- Full `prefers-reduced-motion` support: the boot sequence completes instantly
  and canvases render one static frame.
- Accessible names on every icon-only control; `role="region"` per window,
  `role="navigation"` for the dock, `role="status"` for the boot log.
- `VITE_SKIP_BOOT`, `VITE_BASE_PATH` and `VITE_ALLOWED_HOSTS`.
- The CHRONOS timeline's final marker is stamped with the current year instead
  of a hard-coded one.
- Source maps in production builds.

### Changed

- Drag handling moved from mouse events to pointer events, so touch and stylus
  work. Pointer capture is progressive enhancement; a ref remains the source of
  truth for drag state.
- Closing a window docks it rather than destroying it, matching the fiction
  that these programs are always running.
- `SIMULATION_DEFAULTS` and per-window constants replace magic numbers
  throughout the canvas code.
- The synapse field is centred in its canvas rather than offset.
- The terminal transcript is bounded at 50 lines (`TERMINAL_SCROLLBACK`).
- `index.html` reduced from ~30 kB to ~1.7 kB, with meta description, Open
  Graph tags, `theme-color` and a `<noscript>` notice.
- Prose uses British spelling; platform APIs keep their American spellings.

### Fixed

Three defects surfaced by the first test run:

- **Import cycle.** `config/windows → windows/* → store/osStore →
config/windows` left `WINDOW_REGISTRY` undefined during store
  initialisation. Fixed by splitting metadata into `window-manifest.ts`, which
  may never import components.
- **Missing pointer-capture APIs.** `hasPointerCapture` /
  `setPointerCapture` are absent in jsdom and older browsers; the drag ref is
  now authoritative and capture is optional.
- **Off-by-one in the terminal `help` box.** Rows were padded to
  `innerWidth - 3` instead of `- 2`, so every row was a character short of its
  frame.

Also fixed:

- **Biased shuffle.** `[...items].sort(() => Math.random() - 0.5)` is not a
  uniform shuffle; replaced with Fisher–Yates. This is a correctness issue for
  a tool whose entire purpose is unbiased pairing.
- **Frame-rate-dependent animation.** Time advanced by a fixed increment per
  frame, so animations ran at double speed on 120 Hz displays. Timing is now in
  elapsed seconds.
- **Knowledge graph restarting on hover.** `hoveredNode` sat in the animation
  effect's dependency array, rebuilding the entire graph on change. The hover
  feature had never worked, which is why nobody noticed.
- **Divide-by-zero in the force simulation.** Coincident nodes produced `NaN`
  positions; distance is now floored at 1.
- **Blurry canvases** on HiDPI displays (no device-pixel-ratio scaling).
- **Silent failure** when a 2D context is unavailable; now warns as
  `[daedalus/canvas]` and degrades gracefully.
- **Silent failure** on `main.tsx` mount when `#root` is missing; now throws
  with an explanatory message.
- **Unhandled clipboard rejection** in SYNTH when `navigator.clipboard` is
  unavailable (insecure context).

### Removed

- **Vendor telemetry inlined in `index.html`** — an rrweb session recorder
  capturing DOM mutations, clicks, scrolls and key presses; a page-view beacon
  `POST`ing to a third-party endpoint; and a ~500-line click-to-inspect element
  picker. None of it was referenced by the application, and all of it shipped
  to every visitor. Recoverable from `git show 4d535f2:index.html`. Rationale
  and trade-offs:
  [ADR 0004](docs/decisions/0004-remove-vendor-telemetry.md).
- Dead state and unused imports across the window components, including the
  `hoveredNode` setter that was never called.

### Security

- No backend, no authentication, no secrets, no persistence, no telemetry. The
  only runtime third-party request is the Google Fonts stylesheet for JetBrains
  Mono; instructions for self-hosting it are in
  [`docs/deployment.md`](docs/deployment.md). See
  [`SECURITY.md`](SECURITY.md).

### Notes

The original tree is preserved in git history at commit `4d535f2`. Nothing was
deleted that cannot be recovered from it.

[Unreleased]: https://github.com/zazieproductions/DAEDALUS-V.1/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/zazieproductions/DAEDALUS-V.1/releases/tag/v1.0.0
