# Data and commands

All corpora are authored TypeScript modules. Nothing is loaded from CMS, Wikipedia, or an LLM.

## Catalogs (`src/data/catalogs.ts`)

| Export | Used by |
| --- | --- |
| `obscureQuotes` | Desktop watermark, `quote` command |
| `bookshelf` | Library |
| `ideationPrompts` / `ideationDomains` | Synth |
| `lexiconEntries` | Lexicon |
| `defaultManifesto` | Manifesto |
| `hexagrams` / `tarotMajor` | Oracle |
| `timeline` / `timelineCategoryColor` | Chronos |
| `aesthetics` | Moodboard |
| `graphCategories` | Knowledge Graph |
| `cortexLabels` | Cortex via `generateSynapseData` |

Boot copy lives separately in `src/data/boot.ts` so the BIOS script can be edited without touching scholarly lists.

## Terminal (`src/lib/terminal.ts`)

Commands are pure functions `string[] → string[]`. The window prepends `polymath@daedalus:~$ …` and appends a blank line.

| Command | Output |
| --- | --- |
| `help` | ASCII table of commands |
| `quote` | Random entry from `obscureQuotes` |
| `status` | Fake diagnostics with fresh random numbers |
| `think` | One of six hard-coded thoughts |
| `whoami` | Diegetic identity block |
| `neofetch` | ASCII mark + fake system info |
| `matrix` | 8×60 katakana noise |
| `haiku` | One of three haiku |
| `glitch [text]` | Five `glitchText` passes (5% block-character substitution) |
| `clear` | Store action, not a command function |

Unknown tokens: `nous: command not found`.

The store keeps at most 51 lines (`slice(-50)` then push).

## Randomness

Unseeded `Math.random()`. Sessions are not reproducible. That matches the piece: an oracle that returned the same hexagram every load would feel broken.

## Persistence

None. Reloading is a new boot. The closest thing to memory is the Zustand store for the lifetime of the tab.
