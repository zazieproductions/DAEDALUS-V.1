# 0005 — Authored content lives in `src/data/`, not in components

- **Status:** Accepted
- **Date:** 2026-09-08

## Context

DAEDALUS is roughly half writing: fourteen quotes, sixteen books, fourteen
lexicon entries, seventeen timeline events, sixteen oracle cards, twelve
ideation prompts, eight palettes, a manifesto, a BIOS script and the terminal's
responses.

Originally this was scattered. Some lived in `lib/store.ts` alongside the state
machine; the rest was inlined as module constants inside the components that
rendered it. Editing the corpus meant reading component code, and the store
mixed "what the OS knows" with "what the OS is made of".

## Decision

All authored content lives in `src/data/`, one module per corpus, each
exporting a `SCREAMING_SNAKE_CASE` constant and — where the shape is
non-trivial — its own TypeScript interface:

```
src/data/
├── quotes.ts             QUOTES
├── books.ts              Book, BOOKSHELF, DEFAULT_FAVOURITE_TITLES
├── lexicon.ts            LexiconEntry, LEXICON
├── prompts.ts            IDEATION_PROMPTS, CROSS_POLLINATION_DOMAINS
├── timeline.ts           TimelineEvent, buildTimeline(), formatYear()
├── oracle.ts             OracleCard, OracleDeck, ORACLE_DECKS
├── aesthetics.ts         AestheticPalette, AESTHETIC_PALETTES
├── boot-sequence.ts      BOOT_SEQUENCE + timing constants
├── manifesto.ts          DEFAULT_MANIFESTO
└── terminal-content.ts   Banner, thoughts, haikus, neofetch, whoami
```

Timing constants that are _editorial_ rather than technical live beside the
content they pace — `ORACLE_CAST_DURATION_MS` sits in `oracle.ts`, because 1.2
seconds of suspense is a writing decision.

The store keeps only mutable state. The corpus is imported by whoever needs it.

## Consequences

**Good**

- The corpus is editable without reading a component. A collaborator who wants
  to add ten books never opens a `.tsx` file.
- Content is testable as content. `tests/unit/corpus.test.ts` asserts unique
  book titles (the library keys on them), attributed quotes, five valid hex
  colours per palette, definitions of a plausible length, and enough
  cross-pollination domains for a full round of disjoint pairs.
- The store lost about 60% of its lines and reads as a state machine again.
- Content that needs to stay current can be a function rather than a constant:
  `buildTimeline(now)` stamps its final "you are here" marker with the current
  year, replacing a hard-coded `2024` that had already gone stale.

**Costs**

- One extra import in most windows.
- A judgement call at the boundary: `GRAPH_CATEGORIES` lives in
  `lib/simulations/force-graph.ts` rather than `data/`, because the simulation
  is meaningless without it. The rule is that content lives in `data/` unless a
  pure module cannot function without it.
