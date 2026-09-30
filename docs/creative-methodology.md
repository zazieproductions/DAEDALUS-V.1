# Creative methodology

This document is for the half of the audience that cares less about the
Zustand store than about why a piece of software has an I Ching in it.

## The premise

DAEDALUS // OS is an operating system for a mind that refuses to specialise. It
is presented as a machine from an alternate computing history — one where the
industry optimised for _synthesis_ rather than _productivity_, and shipped
desktop environments with an oracle in the taskbar.

Named for the archetypal maker: the engineer who was also an artist, whose
inventions were both technically ingenious and mythologically loaded, and whose
most famous work was a structure you could get lost inside.

The fiction is not decoration. It is the design constraint that makes the whole
thing coherent. Every decision is answerable to one question: _would this
machine exist?_

## Design rules

**1. The machine must be internally consistent.**
The BIOS mounts `/dev/imagination`, `/dev/intuition` and `/dev/aesthetics`.
The shell is `/bin/nous` — Greek νοῦς, "intellect". The terminal prompt reads
`polymath@daedalus`. Kernel version `nous-4.2.0`. Once you accept the premise,
nothing in the interface contradicts it.

**2. Every window is an argument.**
Not a feature — an argument. If a window cannot be summarised as a claim about
how thinking works, it does not belong.

| Window      | The claim it makes                                                                 |
| ----------- | ---------------------------------------------------------------------------------- |
| TERMINAL    | Ideas deserve a command line: direct, textual, composable.                         |
| CORTEX      | The disciplines are one substrate; the boundaries are administrative.              |
| BIBLIOTHECA | A library is a compressed argument about what is worth knowing.                    |
| SYNTH       | Novelty is combinatorial. Force distant fields to collide and something falls out. |
| GRAPH       | Knowledge has a shape, and it is a network under tension, not a tree.              |
| MANIFESTO   | A practice needs a position, written down, editable.                               |
| ORACLE      | Randomness with good taste beats a blank page.                                     |
| CHRONOS     | Ideas have ancestors; you are standing at the end of a very long rail.             |
| LEXICON     | Vocabulary is a constraint on cognition. Borrow words for thoughts English lacks.  |
| MOODBOARD   | Colour is an argument. Compare eight movements against pure noise and see.         |

**3. The numbers must be honest about being dishonest.**
The four telemetry readouts measure nothing. They drift upward because the walk
is biased, and the interface flatters its operator. That is a joke about
quantified self-improvement, and the code says so plainly in
[`src/config/metrics.ts`](../src/config/metrics.ts). What is _not_ acceptable
is fake precision presented as real measurement.

**4. Latency is content.**
The oracle takes 1.2 seconds to answer. The cross-pollination engine takes 0.8
seconds to "synthesise". Both could be instantaneous. Instant results read as a
lookup; a beat of latency reads as thought. The delays are named constants with
comments explaining that they are deliberate, so no future contributor
"optimises" them away.

**5. Text is data, code is machinery.**
Every quote, book, definition, hexagram and boot line lives in `src/data/`.
Extending the corpus never requires reading a component. This is what makes the
piece _writable_ — the creative work and the engineering work stay separable.

## The combinatorial engine

SYNTH's cross-pollination panel is the most explicit piece of methodology in
the project. Ten deliberately non-adjacent domains — topology, semiotics,
mycology, game theory, phenomenology, acoustics, origami, cryptography,
choreography, fermentation — shuffled and paired.

The value is in the _distance_: "mycology × cryptography" is a usable prompt in
a way that "physics × chemistry" is not. Two implementation choices protect
that:

- **One unbiased shuffle, then consecutive slices.** A domain cannot appear
  twice in a round, which repeated random draws would allow.
- **A real Fisher–Yates shuffle.** The familiar
  `[...items].sort(() => Math.random() - 0.5)` is not a uniform shuffle —
  comparison sorts assume a consistent comparator, and some permutations end up
  far likelier than others. When the entire point of a tool is unbiased
  pairing, a biased shuffle is a correctness bug, not a nitpick.

## Typography and colour

One typeface, JetBrains Mono, at every weight. Monospace everywhere is a claim
that all of this is source code — quotes, definitions, palettes, poetry.

The palette is eight accents on near-black `#0a0a14`. Each window owns exactly
one accent and keeps it: phosphor green for the system, parchment for the
library, amber for the oracle, dusty rose for the lexicon. You learn to
identify a window by its colour before you read its title, the way you learn a
physical instrument panel.

The desktop backdrop layers a neural field at 15% opacity, three coloured
radial washes, 2 px scanlines, and a 40 px grid at 1% opacity. Individually
almost invisible; together they stop the black from reading as "empty div".

## Accessibility, and where the fiction yields

The piece is animated by conviction. It still yields where it should:

- `prefers-reduced-motion` skips the boot sequence and renders canvases as a
  single static frame.
- Every icon-only control has an accessible name; abbreviated metrics carry
  screen-reader-only expansions.
- Every interaction is keyboard-reachable; the boot sequence can be skipped
  with any key.
- Colour is never the only carrier of state — the dock underlines running
  windows as well as tinting them.

Where it does not yield: contrast in the quieter passages is intentionally low
(the watermark quote sits at 8% opacity), and the desktop metaphor assumes a
pointer and a wide screen. Both are noted honestly in the
[roadmap](roadmap.md) rather than quietly ignored.

## Lineage

Explicit debts, in case they are useful reading:

- **Hofstadter, _Gödel, Escher, Bach_** — the structural claim that formal
  systems, art and mind are the same subject.
- **Deleuze & Guattari, _A Thousand Plateaus_** — the rhizome, which is
  literally what the knowledge graph draws.
- **Buckminster Fuller, _Synergetics_** — the generalist as a serious position.
- **Vaporwave and dead-media aesthetics** — the emotional register of an
  interface from a history that did not happen.
- **The demoscene** — the conviction that a program can be a piece of work in
  itself.
- **Xerox Alto / early NeXTSTEP** — the window manager grammar being sampled.
