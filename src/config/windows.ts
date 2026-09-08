import { WINDOW_MANIFEST } from '@/config/window-manifest';
import type { WindowDescriptor, WindowId } from '@/types/os';
import ChronosWindow from '@/windows/ChronosWindow';
import CortexWindow from '@/windows/CortexWindow';
import GraphWindow from '@/windows/GraphWindow';
import LexiconWindow from '@/windows/LexiconWindow';
import LibraryWindow from '@/windows/LibraryWindow';
import ManifestoWindow from '@/windows/ManifestoWindow';
import MoodboardWindow from '@/windows/MoodboardWindow';
import OracleWindow from '@/windows/OracleWindow';
import SynthWindow from '@/windows/SynthWindow';
import TerminalWindow from '@/windows/TerminalWindow';

/**
 * The window registry: the manifest, bound to its React components.
 *
 * This is the *only* module that imports window components, which keeps the
 * dependency graph a DAG — see the note in `window-manifest.ts`. It is
 * consumed by `Desktop` and by the tests that assert the registry is complete.
 */
const COMPONENTS: Record<WindowId, WindowDescriptor['component']> = {
  terminal: TerminalWindow,
  cortex: CortexWindow,
  library: LibraryWindow,
  synth: SynthWindow,
  graph: GraphWindow,
  manifesto: ManifestoWindow,
  oracle: OracleWindow,
  chronos: ChronosWindow,
  lexicon: LexiconWindow,
  moodboard: MoodboardWindow,
};

export const WINDOW_REGISTRY: readonly WindowDescriptor[] = WINDOW_MANIFEST.map((entry) => ({
  ...entry,
  component: COMPONENTS[entry.id],
}));

export { WINDOW_IDS, WINDOWS_BY_ID } from '@/config/window-manifest';
