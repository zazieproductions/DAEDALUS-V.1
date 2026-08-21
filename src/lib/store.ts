import { create } from 'zustand';

export type WindowId = 'terminal' | 'cortex' | 'library' | 'synth' | 'graph' | 'manifesto' | 'oracle' | 'chronos' | 'lexicon' | 'moodboard';

interface WindowState {
  id: WindowId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  zIndex: number;
}

interface OSState {
  windows: Record<WindowId, WindowState>;
  activeWindow: WindowId | null;
  topZ: number;
  bootComplete: boolean;
  terminalLines: string[];
  currentTime: Date;
  geniusScore: number;
  polymathIndex: number;
  obscurityRating: number;
  creativePulse: number;
  setActiveWindow: (id: WindowId) => void;
  toggleMinimize: (id: WindowId) => void;
  setBoot: (v: boolean) => void;
  addTerminalLine: (line: string) => void;
  setTime: (d: Date) => void;
  updateMetrics: () => void;
  moveWindow: (id: WindowId, x: number, y: number) => void;
}

const defaultWindows: Record<WindowId, WindowState> = {
  terminal: { id: 'terminal', title: 'TERMINAL // νοῦς', x: 20, y: 60, w: 520, h: 340, minimized: false, zIndex: 1 },
  cortex: { id: 'cortex', title: 'CORTEX MAPPER', x: 560, y: 60, w: 440, h: 340, minimized: false, zIndex: 2 },
  library: { id: 'library', title: 'BIBLIOTHECA UNIVERSALIS', x: 20, y: 420, w: 400, h: 320, minimized: false, zIndex: 3 },
  synth: { id: 'synth', title: 'SYNTH // IDEATION ENGINE', x: 440, y: 420, w: 380, h: 320, minimized: false, zIndex: 4 },
  graph: { id: 'graph', title: 'KNOWLEDGE GRAPH', x: 840, y: 420, w: 380, h: 320, minimized: false, zIndex: 5 },
  manifesto: { id: 'manifesto', title: 'MANIFESTO EDITOR', x: 1020, y: 60, w: 360, h: 340, minimized: true, zIndex: 6 },
  oracle: { id: 'oracle', title: 'ORACLE // DIVINATION', x: 200, y: 200, w: 400, h: 300, minimized: true, zIndex: 7 },
  chronos: { id: 'chronos', title: 'CHRONOS // DEEP TIME', x: 300, y: 150, w: 500, h: 350, minimized: true, zIndex: 8 },
  lexicon: { id: 'lexicon', title: 'LEXICON OBSCURA', x: 150, y: 100, w: 420, h: 350, minimized: true, zIndex: 9 },
  moodboard: { id: 'moodboard', title: 'MOODBOARD // ΑΙΣΘΗΣΙΣ', x: 400, y: 180, w: 500, h: 380, minimized: true, zIndex: 10 },
};

export const useOSStore = create<OSState>((set, get) => ({
  windows: defaultWindows,
  activeWindow: 'terminal',
  topZ: 10,
  bootComplete: false,
  terminalLines: [],
  currentTime: new Date(),
  geniusScore: 94.7,
  polymathIndex: 87.3,
  obscurityRating: 96.1,
  creativePulse: 78.5,
  setActiveWindow: (id) => {
    const newZ = get().topZ + 1;
    set((s) => ({
      activeWindow: id,
      topZ: newZ,
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], zIndex: newZ, minimized: false },
      },
    }));
  },
  toggleMinimize: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], minimized: !s.windows[id].minimized },
      },
      activeWindow: s.windows[id].minimized ? id : s.activeWindow === id ? null : s.activeWindow,
    })),
  setBoot: (v) => set({ bootComplete: v }),
  addTerminalLine: (line) =>
    set((s) => ({ terminalLines: [...s.terminalLines.slice(-50), line] })),
  setTime: (d) => set({ currentTime: d }),
  updateMetrics: () =>
    set((s) => ({
      geniusScore: Math.min(99.9, Math.max(80, s.geniusScore + (Math.random() - 0.45) * 0.8)),
      polymathIndex: Math.min(99.9, Math.max(70, s.polymathIndex + (Math.random() - 0.45) * 0.6)),
      obscurityRating: Math.min(99.9, Math.max(85, s.obscurityRating + (Math.random() - 0.48) * 0.4)),
      creativePulse: Math.min(99.9, Math.max(60, s.creativePulse + (Math.random() - 0.4) * 1.2)),
    })),
  moveWindow: (id, x, y) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], x, y },
      },
    })),
}));

export const obscureQuotes = [
  '"The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion." — Camus',
  '"We are what we pretend to be, so we must be careful about what we pretend to be." — Vonnegut',
  '"The task is not so much to see what no one has yet seen; but to think what nobody has yet thought, about that which everybody sees." — Schrödinger',
  '"I must create a system, or be enslav\'d by another man\'s." — Blake',
  '"The universe is made of stories, not of atoms." — Muriel Rukeyser',
  '"In the middle of difficulty lies opportunity." — Einstein',
  '"Art is the lie that enables us to realize the truth." — Picasso',
  '"The map is not the territory." — Korzybski',
  '"Ceci n\'est pas une pipe." — Magritte',
  '"The medium is the message." — McLuhan',
  '"Ars longa, vita brevis." — Hippocrates',
  '"Πάντα ῥεῖ (Everything flows)." — Heraclitus',
  '"The Tao that can be told is not the eternal Tao." — Lao Tzu',
  '"Whereof one cannot speak, thereof one must be silent." — Wittgenstein',
];

export const bookshelf = [
  { title: 'Gödel, Escher, Bach', author: 'Hofstadter', year: 1979, field: 'metamathematics' },
  { title: 'A Thousand Plateaus', author: 'Deleuze & Guattari', year: 1980, field: 'philosophy' },
  { title: 'The Structure of Scientific Revolutions', author: 'Kuhn', year: 1962, field: 'epistemology' },
  { title: 'Synergetics', author: 'Buckminster Fuller', year: 1975, field: 'systems theory' },
  { title: 'The Arcades Project', author: 'Walter Benjamin', year: 1999, field: 'critical theory' },
  { title: 'Cybernetics', author: 'Norbert Wiener', year: 1948, field: 'cybernetics' },
  { title: 'Anti-Oedipus', author: 'Deleuze & Guattari', year: 1972, field: 'schizoanalysis' },
  { title: 'The Society of the Spectacle', author: 'Debord', year: 1967, field: 'situationism' },
  { title: 'Pale Fire', author: 'Nabokov', year: 1962, field: 'metafiction' },
  { title: 'Tractatus Logico-Philosophicus', author: 'Wittgenstein', year: 1921, field: 'logic' },
  { title: 'The Phenomenology of Spirit', author: 'Hegel', year: 1807, field: 'phenomenology' },
  { title: 'Simulacra and Simulation', author: 'Baudrillard', year: 1981, field: 'hyperreality' },
  { title: 'Finnegans Wake', author: 'Joyce', year: 1939, field: 'experimental lit' },
  { title: 'The Order of Things', author: 'Foucault', year: 1966, field: 'archaeology' },
  { title: 'Principia Mathematica', author: 'Whitehead & Russell', year: 1910, field: 'logic' },
  { title: 'Being and Time', author: 'Heidegger', year: 1927, field: 'ontology' },
];

export const ideationPrompts = [
  'What if consciousness is a standing wave in a field of pure information?',
  'Design a city where architecture responds to collective emotional states.',
  'Create a programming language based on musical notation and set theory.',
  'What would a post-scarcity economy look like through the lens of gift theory?',
  'Imagine a library that contains every book that will never be written.',
  'How would Borges design a search engine?',
  'What if we could compile dreams into executable programs?',
  'Design a typeface that changes based on the semantic content of the text.',
  'Create an instrument that plays the electromagnetic spectrum of emotions.',
  'What would happen if we applied category theory to social relationships?',
  'Architect a museum where the building itself is the only exhibit.',
  'How would you encode the complete works of Shakespeare in DNA?',
];

export const lexiconEntries = [
  { term: 'Apophenia', def: 'The tendency to perceive meaningful connections between unrelated things.' },
  { term: 'Saudade', def: 'A deep emotional state of nostalgic longing for something absent.' },
  { term: 'Tsundoku', def: '積ん読 — Acquiring books and letting them pile up unread.' },
  { term: 'Wabi-sabi', def: '侘寂 — Finding beauty in imperfection and transience.' },
  { term: 'Eudaimonia', def: 'εὐδαιμονία — Human flourishing; the highest human good.' },
  { term: 'Duende', def: 'A heightened state of emotion and authenticity in art.' },
  { term: 'Fernweh', def: 'An ache for distant places; the opposite of homesickness.' },
  { term: 'Meraki', def: 'μεράκι — Doing something with soul, creativity, and love.' },
  { term: 'Mono no aware', def: '物の哀れ — The pathos of things; awareness of impermanence.' },
  { term: 'Jouissance', def: 'Transgressive pleasure beyond the pleasure principle.' },
  { term: 'Bricolage', def: 'Creating from a diverse range of available things.' },
  { term: 'Palimpsest', def: 'Something reused or altered but still bearing traces of its earlier form.' },
  { term: 'Heterotopia', def: 'Spaces of otherness; counter-sites that mirror and disturb real spaces.' },
  { term: 'Rhizome', def: 'A non-hierarchical network of connections without beginning or end.' },
];
