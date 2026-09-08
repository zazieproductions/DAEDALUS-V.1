# Deployment

DAEDALUS builds to a directory of static files. Any static host will serve it:
no Node runtime, no server rendering, no environment secrets.

```bash
npm ci
npm run build      # → dist/
npm run preview    # verify the production build locally
```

Typical output:

```
dist/index.html                  ~1.7 kB │ gzip:  0.8 kB
dist/assets/index-*.css         ~18   kB │ gzip:  4.5 kB
dist/assets/index-*.js         ~385   kB │ gzip: 125  kB
```

Source maps are emitted deliberately. This is a portfolio artefact; the code is
part of what is on display.

## Base paths

If the app is served from anywhere other than the domain root, the bundle needs
a matching base path or every asset 404s:

```bash
VITE_BASE_PATH=/DAEDALUS-V.1/ npm run build
```

The value must have a leading **and** trailing slash. `src/config/env.ts`
re-exports Vite's resolved `BASE_URL`, and the desktop backdrop composes its
image URL from it, so the wallpaper follows the base path automatically.

## GitHub Pages

A workflow is included at
[`.github/workflows/pages.yml`](../.github/workflows/pages.yml). It is
**manual-dispatch only**, so a repository with Pages disabled never shows a red
workflow.

1. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Repository → **Actions → Deploy to GitHub Pages → Run workflow**.

The workflow sets `VITE_BASE_PATH=/${{ github.event.repository.name }}/`
automatically, so a project site works without further configuration. The
result lands at `https://<user>.github.io/<repo>/`.

To deploy on every push to `main` instead, add a `push` trigger to that
workflow — the job itself needs no other change.

## Netlify / Vercel / Cloudflare Pages

| Setting       | Value                                   |
| ------------- | --------------------------------------- |
| Build command | `npm run build`                         |
| Output dir    | `dist`                                  |
| Node version  | 22 (`.nvmrc` is respected by all three) |
| Env variables | none required                           |

Custom domains at the root need no `VITE_BASE_PATH`.

## Self-hosting

Any static file server works. There is no client-side router, so no SPA
rewrite rule is required — `index.html` is the only HTML document.

```nginx
server {
  root /var/www/daedalus/dist;
  index index.html;

  # Hashed assets are immutable; the entry document must not be cached.
  location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
  location = /index.html { add_header Cache-Control "no-cache"; }
}
```

## Runtime dependencies in production

One external request: the JetBrains Mono stylesheet from Google Fonts,
preconnected in `index.html`. If that is unacceptable (offline installs, strict
CSP, privacy requirements), self-host the font:

1. Download the JetBrains Mono web font files into `public/fonts/`.
2. Replace the `<link>` tags in `index.html` with an `@font-face` block in
   `src/styles/global.css`.

Blocking the request without doing either is also fine — the interface falls
back to the platform monospace face and remains fully legible.

Nothing else leaves the browser: no analytics, no telemetry, no storage. See
[`SECURITY.md`](../SECURITY.md).

## Suggested Content-Security-Policy

```
default-src 'self';
img-src 'self' data:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
script-src 'self';
connect-src 'self';
```

`'unsafe-inline'` for styles is required because the window chrome themes
itself with inline `style` props derived from each window's accent colour. Drop
`fonts.googleapis.com` / `fonts.gstatic.com` if you self-host the font.
