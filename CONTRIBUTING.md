# Contributing

DAEDALUS // OS is a finished *register* of a creative-technology work, not a general-purpose desktop framework. Changes should deepen the polymathic OS, not sand it into a product.

## Aesthetic constraints

- Phosphor `#00ff88` on void `#0a0a14`. Accents already live in `src/config/theme.ts` — extend that file, do not invent a second palette.
- JetBrains Mono only. No geometric sans, no card layouts, no marketing gradients.
- Copy is diegetic. Error messages, empty states, and tooltips should sound like the machine, not like a SaaS tooltip.
- Do not add a real backend, auth wall, or analytics pixel. The isolation is the point.
- Do not “fix” theatrical telemetry by wiring it to genuine metrics unless the fiction is explicitly retired in `ARCHITECTURE.md`.

## Engineering constraints

- Distinguish **working / partial / planned** in docs when you touch a module.
- Do not implement MAXIMIZE, persistence, or audio unless you also update the honesty tables.
- Window default layout is authored for a large desktop field. Do not silently convert it into a mobile app.
- Keep Canvas work inside the two existing surfaces unless a new window genuinely needs a third loop.
- Production deploys from GitHub Pages at `/DAEDALUS-V.1/`. Use `import.meta.env.BASE_URL` for public assets.

## Local loop

```bash
npm ci
npm run dev
```

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Screenshots (optional, requires Chromium):

```bash
npx playwright install chromium
npm run build
npm run capture
```

`?skipBoot=1` jumps the BIOS dump.

## Pull requests

Use the template. Include a screenshot if the desktop chrome or a canvas loop changed. Say whether the change is visible in the live fiction or only in the archive (docs/CI).
