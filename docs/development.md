# Development

## Requirements

- **Node 20.19+** or **22+** (Vite 7's floor). `.nvmrc` pins 22, which is what
  CI uses.
- npm 10+ (ships with those Node versions).

No global tooling, no native build steps, no database.

## Setup

```bash
git clone https://github.com/zazieproductions/DAEDALUS-V.1.git
cd DAEDALUS-V.1
npm install
cp .env.example .env.local   # optional
npm run dev
```

## Scripts

| Script                  | What it does                                                    |
| ----------------------- | --------------------------------------------------------------- |
| `npm run dev`           | Vite dev server with HMR, listening on all interfaces.          |
| `npm run build`         | Typecheck the app, then build to `dist/` (with source maps).    |
| `npm run preview`       | Serve the production build locally.                             |
| `npm run typecheck`     | `tsc -b` across app, node and test projects.                    |
| `npm run lint`          | ESLint over the whole repo.                                     |
| `npm run lint:fix`      | …and fix what it can.                                           |
| `npm run format`        | Prettier, write.                                                |
| `npm run format:check`  | Prettier, verify. This is what CI runs.                         |
| `npm test`              | Vitest, single run.                                             |
| `npm run test:watch`    | Vitest, watch mode.                                             |
| `npm run test:coverage` | Vitest with a V8 coverage report in `coverage/`.                |
| `npm run validate`      | **The one to remember.** format → lint → types → tests → build. |
| `npm run docs:diagram`  | Regenerate `docs/media/desktop-layout.svg` from the manifest.   |
| `npm run clean`         | Remove `dist/`, `coverage/` and tool caches.                    |

`npm run validate` is exactly what CI runs, in the same order. If it passes
locally, CI passes.

## Environment variables

All optional, all build/dev-time. See [`.env.example`](../.env.example).

| Variable             | Purpose                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| `VITE_SKIP_BOOT`     | Skip the ~3 s BIOS animation. Set this while working on a window.      |
| `VITE_BASE_PATH`     | Serve from a sub-path, e.g. `/DAEDALUS-V.1/` for a Pages project site. |
| `VITE_ALLOWED_HOSTS` | Extra dev-server hostnames to trust (cloud IDEs, preview proxies).     |

They are read once, in [`src/config/env.ts`](../src/config/env.ts), which
validates them and warns on nonsense rather than failing silently. No component
touches `import.meta.env` directly.

### Developing in a container or cloud IDE

Vite's dev server rejects unknown hostnames (a DNS-rebinding protection). If
your preview URL is proxied, add it:

```bash
echo 'VITE_ALLOWED_HOSTS=my-workspace-5173.example.dev' >> .env.local
```

## Conventions

| Thing                   | Convention                          | Example                              |
| ----------------------- | ----------------------------------- | ------------------------------------ |
| Component files         | `PascalCase.tsx`, one per component | `OracleWindow.tsx`                   |
| Window components       | `<Name>Window`                      | `CortexWindow`                       |
| Hooks                   | `useCamelCase.ts`                   | `useAnimationCanvas.ts`              |
| Library / data / config | `kebab-case.ts`                     | `force-graph.ts`                     |
| Exported constant data  | `SCREAMING_SNAKE_CASE`              | `AESTHETIC_PALETTES`                 |
| Types and interfaces    | `PascalCase`, no `I` prefix         | `WindowDescriptor`                   |
| Internal imports        | Always the `@/` alias               | `import { env } from '@/config/env'` |

Both TypeScript and Vite resolve `@/*` to `src/*`, so no module in the codebase
imports through `../../..`.

Comments and identifiers use British spelling (`minimised`, `colour`) except
where a platform API dictates otherwise (`color`, `center`, `getContext`).

## Testing strategy

```
tests/
├── setup.ts              jsdom shims: matchMedia, canvas 2D context, scrollIntoView
├── unit/                 Pure logic — fast, exhaustive, no DOM
│   ├── lib-text-random.test.ts
│   ├── geometry-metrics.test.ts
│   ├── simulations.test.ts
│   ├── terminal-commands.test.ts
│   ├── corpus.test.ts
│   ├── theme-tokens.test.ts
│   └── os-store.test.ts
└── integration/          Behavioural — Testing Library over the real component tree
    └── desktop.test.tsx
```

Two rules:

1. **Assert behaviour, never markup.** Tests query by role and accessible name
   (`getByRole('button', { name: 'Minimise …' })`), never by class or test id.
   The visual design is meant to keep moving; the mechanics are not.
2. **Inject randomness.** Anything stochastic takes an optional `random`
   parameter, so simulations and commands are deterministic under test while
   staying genuinely random at runtime.

Notable guards worth knowing about, because they will fail on you eventually:

- `theme-tokens.test.ts` reads `src/styles/global.css` and asserts the `@theme`
  tokens match `src/config/theme.ts`. Change one, change both.
- `os-store.test.ts` validates the whole window manifest — a malformed entry
  fails the suite, not the runtime.
- CI regenerates the layout diagram and fails if the committed SVG is stale.

Zustand stores are module singletons, so tests reset state explicitly:

```ts
useOSStore.setState(useOSStore.getInitialState(), true);
```

## Debugging notes

**Canvas not drawing.** `useAnimationCanvas` logs
`[daedalus/canvas] 2D context unavailable` and degrades to nothing rendered.
Everything else in the window keeps working.

**An animation restarts unexpectedly.** The `draw` callback is held in a ref
precisely so this cannot happen. If it does, check whether you added a
dependency to the hook's size/paused effect.

**A window vanished.** It cannot go off-screen (`clampWindowPosition`), so it
is docked — check the dock, or `useOSStore.getState().windows`.

**Boot sequence in the way.** `VITE_SKIP_BOOT=true`, or click anywhere.
