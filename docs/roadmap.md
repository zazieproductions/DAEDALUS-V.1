# Roadmap

Kept honest, in three tiers. Nothing below is described as if it exists.

## Shipped

Everything here is implemented, tested and running on `main`.

- BIOS boot sequence with skip (click, key, `prefers-reduced-motion`, env flag)
- Registry-driven window manager: drag, focus, stack, dock, maximise/restore
- Ten windows (terminal, cortex, library, synth, graph, manifesto, oracle,
  chronos, lexicon, moodboard)
- Terminal with ten commands, generated `help`, history, bounded transcript
- Two canvas simulations: force-directed knowledge graph, animated synapse field
- Four bounded random-walk telemetry readouts, circadian greeting, live clock
- Accessibility pass: accessible names, keyboard operability, reduced-motion
- Tooling: ESLint + Prettier + strict TypeScript, Vitest (100 tests), CI,
  manual Pages deploy, generated layout diagram

## Planned

Deliberate next steps, roughly in order.

| Item                       | Why                                                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Window resize handles      | The most-missed window-manager affordance; needs per-window minimum sizes.                                                                                                              |
| Opt-in session persistence | A `PERSIST=on` terminal command, so layout survives reload _by choice_. Keeps the "boots clean" default intact — see [decisions/0002](decisions/0002-zustand-kernel-no-persistence.md). |
| Keyboard window management | `Alt+Tab` cycling, `Alt+1…0` to focus by dock position, `Esc` to dock.                                                                                                                  |
| Seeded session RNG         | One seed for every stochastic system, printable and shareable, so a session is reproducible. All the plumbing (injectable `random`) already exists.                                     |
| A tablet-scale layout      | Not a phone layout — a second hand-placed arrangement below ~1100 px.                                                                                                                   |
| Visual regression tests    | Playwright screenshots of the desktop and each window, diffed in CI.                                                                                                                    |
| Self-hosted JetBrains Mono | Removes the only external runtime request.                                                                                                                                              |

## Speculative

Ideas that fit the fiction. Unimplemented, unscheduled, and possibly bad —
listed because the project's premise is that unlikely combinations are worth
writing down.

- **CHOIR** — sonification of the knowledge graph: each faculty a timbre, each
  edge a voice, the force simulation driving a drone via the Web Audio API.
- **PALIMPSEST** — a window that shows the edit history of the manifesto as
  geological strata.
- **ENTROPY // ΧΑΟΣ** — a constraint generator: draws limitations rather than
  prompts, on the theory that constraint produces more than freedom does.
- **A real file system** — `/dev/imagination` as a browsable tree whose files
  are generated on read.
- **Inter-window pipes** — `cortex | synth`: send the selected discipline from
  one window into another as input. The most technically interesting idea here,
  and the one most likely to break the simplicity of the store.
- **Multi-user noosphere** — two browsers, one shared desktop, over WebRTC.
- **A printed edition** — the corpus and the manifesto typeset as a physical
  book, generated from the same `src/data/` modules.

## Explicitly not planned

- **A backend.** The absence of a server is a feature: no accounts, no data, no
  privacy surface.
- **A component library.** The windows are supposed to feel like ten programs
  that agreed only on a window manager. Unifying them would flatten the piece.
- **Making the metrics real.** They are a joke about quantified self-improvement.
  Wiring them to something measurable would ruin it.
- **A phone layout.** The desktop metaphor is the medium. A responsive
  single-column version would be a different work.
