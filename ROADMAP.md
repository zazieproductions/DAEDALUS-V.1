# Roadmap

Priorities for anyone continuing the work. None of these are implemented.

## 1. Persistence that still feels like an OS

Session-only manifesto text and library stars vanish on reload. A restrained `localStorage` layer (manifesto, favorites, window positions) would make the machine remember without adding a backend. Do not add accounts.

## 2. A real window manager

Maximize is labeled offline. There is no resize handle, no snap, no keyboard focus cycle. Implementing size + maximize + a `Tab` focus ring would complete the chrome the title bar already implies.

## 3. Honest viewport policy

The default layout is authored for ~1440×900. Either:

- add a diegetic `VIEWPORT TOO NARROW` interlock with an override, or
- scale the whole desktop as a camera, not as responsive cards.

Do not turn the OS into a stacked mobile app.

## Later, if the fiction requires it

- **Web Audio boot chord** — the `[AUD]` line is currently a lie. A short unlock-on-click tone would make that line true. Do not autoplay.
- **Metrics from interaction** — derive GQ/PI/OR/CP from terminal use, oracle casts, and graph hover instead of a random walk, *or* keep the walk and leave the docs honest.
- **Seeded procedural state** — a `?seed=` so a session can be cited.
- **Touch drag** — pointer events on the title bar.

Out of scope unless the piece changes identity: user accounts, LLM-backed oracle, real knowledge-graph databases, plugin stores.
