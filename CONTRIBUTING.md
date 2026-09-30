# Contributing to DAEDALUS // OS

Thanks for looking. This is a creative-technology piece as much as it is
software, so contributions are judged on two axes: does it work, and does it
belong.

## Ground rules

1. **Preserve the fiction.** DAEDALUS is an operating system that never
   existed. Copy is written in its voice — clipped, technical, a little
   grandiose, occasionally in Greek. A perfectly engineered feature written in
   product-marketing English does not belong here.
2. **Content is data.** Quotes, books, lexicon entries, timeline events and
   prompts live in `src/data/`, never inline in components. Adding to the
   corpus should never require touching a component.
3. **The manifest is the source of truth.** Windows are declared once, in
   `src/config/window-manifest.ts`. If you find yourself adding a `switch` on
   `WindowId`, something has gone wrong.
4. **Keep intentional weirdness.** The metrics are fake, the oracle is random,
   the boot sequence mounts `/dev/imagination`. These are not bugs. If you
   think one is, open an issue before "fixing" it.

## Getting set up

```bash
git clone https://github.com/zazieproductions/DAEDALUS-V.1.git
cd DAEDALUS-V.1
npm install
npm run dev
```

Node 20.19+ (or 22+) is required; `.nvmrc` pins the version CI uses.

Set `VITE_SKIP_BOOT=true` in `.env.local` while iterating — waiting three
seconds for the BIOS on every reload gets old fast.

## Before you open a pull request

```bash
npm run validate   # format:check → lint → typecheck → test → build
```

CI runs exactly this, plus a check that the generated layout diagram matches
the manifest. If you changed `src/config/window-manifest.ts`:

```bash
npm run docs:diagram
```

## Adding a window

The whole point of the architecture is that this is a three-step change.

1. Create `src/windows/<Name>Window.tsx`. Default-export a component that takes
   no props and renders its own interior. It may read the store; it must not
   know about the shell.
2. Add the id to the `WindowId` union in `src/types/os.ts`.
3. Append an entry to `WINDOW_MANIFEST` in `src/config/window-manifest.ts` and
   wire the component into `COMPONENTS` in `src/config/windows.ts`.

The dock, the desktop, the store, the tests and the layout diagram all pick it
up automatically. `docs/window-system.md` walks through this in detail.

## Adding a terminal command

Add an entry to `TERMINAL_COMMANDS` in `src/features/terminal/commands.ts`.
`help` is generated from that table, so there is nothing else to update. Long
output belongs in `src/data/terminal-content.ts`.

## Conventions

| Thing                   | Convention                          | Example                              |
| ----------------------- | ----------------------------------- | ------------------------------------ |
| Component files         | `PascalCase.tsx`, one per component | `OracleWindow.tsx`                   |
| Window components       | `<Name>Window`                      | `CortexWindow`                       |
| Hooks                   | `useCamelCase.ts`                   | `useAnimationCanvas.ts`              |
| Library / data / config | `kebab-case.ts`                     | `force-graph.ts`                     |
| Exported constant data  | `SCREAMING_SNAKE_CASE`              | `AESTHETIC_PALETTES`                 |
| Types and interfaces    | `PascalCase`, no `I` prefix         | `WindowDescriptor`                   |
| Imports inside `src/`   | Always the `@/` alias               | `import { env } from '@/config/env'` |

Prose in code comments (and this repository generally) uses British spelling —
`minimised`, `maximised`, `colour` in comments — while DOM and CSS APIs keep
their American spellings (`color`, `center`). Yes, that is a little strange;
it is consistent, which matters more.

## Tests

- Pure logic (`src/lib`, `src/config`, `src/features`, `src/store`) → unit test
  in `tests/unit/`.
- Anything a user does → behavioural test in `tests/integration/` using
  Testing Library. Assert behaviour, never markup: the visual design is meant
  to keep moving.

## Commits

Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`) with a
scope where it helps: `feat(oracle): add hexagram changing lines`.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
