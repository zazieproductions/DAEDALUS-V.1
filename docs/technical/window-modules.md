# Window modules

Honesty table. “Working” means the UI does what it claims inside the session. “Partial” means a control exists whose effect is incomplete. Nothing here calls a network.

| ID | Title | Status | Behavior |
| --- | --- | --- | --- |
| `terminal` | TERMINAL // νοῦς | Working | Command interpreter. See [data-and-commands.md](./data-and-commands.md). History via ↑/↓. `clear` empties the store buffer. |
| `cortex` | CORTEX MAPPER | Working | Canvas synapse map. Discipline chips toggle an active node (coral). |
| `library` | BIBLIOTHECA UNIVERSALIS | Partial | Search + field filter work. Star favorites are session-only `Set` state. |
| `synth` | SYNTH // IDEATION ENGINE | Working | Cycles curated prompts; COPY uses Clipboard API; cross-pollination shuffles domain pairs with an 800ms fake synthesize delay. |
| `graph` | KNOWLEDGE GRAPH | Working | Force-directed canvas; mouse attracts nearby nodes; hover brightens. Topology is random at mount. |
| `manifesto` | MANIFESTO EDITOR | Partial | Textarea edits in memory. SAVE flashes `SAVED` for 2s and writes nowhere. Reset restores the default text. |
| `oracle` | ORACLE // DIVINATION | Working | Uniform pick from 8 hexagrams or 8 Major Arcana after a 1.2s “cast” delay. Not a real yarrow-stalk or tarot shuffle. |
| `chronos` | CHRONOS // DEEP TIME | Working | 17 curated events, linear navigator, category color. |
| `lexicon` | LEXICON OBSCURA | Working | Client-side filter; click expands definition. |
| `moodboard` | MOODBOARD // ΑΙΣΘΗΣΙΣ | Working | Eight named palettes plus a 5-swatch `randomHex()` generative row. |

Default mount: terminal, cortex, library, synth, graph are open. The other five start minimized.

## What these tools are for

They are not productivity software. Each module is a **lens**:

- Terminal is the voice of the machine (commands return poetry and fake diagnostics).
- Cortex / Graph make interdisciplinarity visible as glowing edges.
- Library / Lexicon / Chronos are an archival cabinet — small, authored, complete.
- Synth / Oracle / Moodboard inject chance into the session so the desktop never quite repeats.

If a control looks like a real OS affordance (SAVE, MAXIMIZE, CLOSE), check this table before treating it as a backend.
