# Troubleshooting

## Setup and build

**`npm install` fails, or Vite refuses to start.**
Check your Node version: `node --version`. Vite 7 requires 20.19+ or 22+.
`.nvmrc` pins 22 — `nvm use` will pick it up.

**`npm ci` complains the lockfile is out of sync.**
`package-lock.json` is committed and authoritative. If you changed
`package.json` by hand, run `npm install` to refresh the lockfile and commit it.

**Typecheck passes but `npm run build` fails.**
They cover different projects. `npm run typecheck` runs `tsc -b` across app,
node (`vite.config.ts`) and test projects; `npm run build` typechecks only the
app. Run `npm run validate` to exercise everything at once.

**Prettier fails in CI but the code looks fine.**
CI runs `format:check`, not `format`. Run `npm run format` and commit.

## Dev server

**The browser shows "Blocked request. This host is not allowed."**
Vite's dev server rejects unknown hostnames to guard against DNS rebinding. Add
yours:

```bash
echo 'VITE_ALLOWED_HOSTS=my-host.example.dev' >> .env.local
```

**Port 5173 is taken.**
`npm run dev -- --port 3000`.

**Changes to `.env.local` do nothing.**
Vite reads env files at startup. Restart the dev server. Also check the
variable is prefixed `VITE_` — anything else is invisible to the client by
design.

## Runtime

**The boot sequence is in the way while I work.**
Click, press any key, or set `VITE_SKIP_BOOT=true` in `.env.local`.

**The canvases are blank.**
Look for `[daedalus/canvas] 2D context unavailable` in the console: the browser
refused a 2D context (hardware acceleration disabled, an aggressive privacy
extension, or a headless environment). The rest of the window still works.

**Nothing animates.**
Most likely your OS is set to reduce motion, which DAEDALUS honours: the boot
sequence completes instantly and canvases render a single static frame. Toggle
it in your system's accessibility settings.

**A window disappeared.**
It is docked, not lost — windows cannot be dragged off-screen
(`clampWindowPosition` guarantees at least 96 px of grab area stays visible).
Check the dock in the top bar, or in the console:

```js
Object.values(useOSStore.getState().windows).filter((w) => w.minimised);
```

**Windows overlap awkwardly / are cut off.**
The default layout is hand-placed for a viewport of roughly 1400 × 800 or
larger. On smaller screens, drag or maximise. Responsive layout is on the
[roadmap](roadmap.md), not implemented.

**The manifesto I edited is gone after a refresh.**
Working as designed. Nothing is persisted — the OS boots identically every
time. See [decisions/0002](decisions/0002-zustand-kernel-no-persistence.md).

**Text renders in the wrong typeface.**
The Google Fonts request for JetBrains Mono was blocked or is offline. The
interface falls back to the system monospace face. To self-host the font, see
[deployment.md](deployment.md).

**"Clipboard unavailable" when copying a SYNTH prompt.**
`navigator.clipboard` requires a secure context. Use `localhost` or HTTPS —
plain HTTP on a LAN address will not work in most browsers.

## Tests

**Tests fail with `matchMedia is not a function` or canvas errors.**
`tests/setup.ts` stubs both. Make sure your test file has not overridden
`setupFiles`, and that it does not opt into the `node` environment while
touching the DOM.

**A store test bleeds into the next one.**
Zustand stores are module singletons. Reset in `beforeEach`:

```ts
useOSStore.setState(useOSStore.getInitialState(), true);
```

**CI fails on "layout diagram is stale".**
You changed `src/config/window-manifest.ts` without regenerating the diagram:

```bash
npm run docs:diagram && git add docs/media/desktop-layout.svg
```

**`theme-tokens.test.ts` fails after a colour change.**
Design tokens live in two places by necessity — `src/config/theme.ts` for
inline styles and `src/styles/global.css` for Tailwind. That test is the thing
keeping them honest. Update both.
