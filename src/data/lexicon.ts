/** An entry in LEXICON OBSCURA. */
export interface LexiconEntry {
  /** The word, in its native orthography where relevant. */
  term: string;
  /** A one-sentence gloss — these words resist definition by design. */
  definition: string;
}

/**
 * Untranslatable concepts: words that name a thought English has no handle for.
 * The window's thesis is that vocabulary is a constraint on cognition.
 */
export const LEXICON: readonly LexiconEntry[] = [
  {
    term: 'Apophenia',
    definition: 'The tendency to perceive meaningful connections between unrelated things.',
  },
  {
    term: 'Saudade',
    definition: 'A deep emotional state of nostalgic longing for something absent.',
  },
  { term: 'Tsundoku', definition: '積ん読 — Acquiring books and letting them pile up unread.' },
  { term: 'Wabi-sabi', definition: '侘寂 — Finding beauty in imperfection and transience.' },
  { term: 'Eudaimonia', definition: 'εὐδαιμονία — Human flourishing; the highest human good.' },
  { term: 'Duende', definition: 'A heightened state of emotion and authenticity in art.' },
  { term: 'Fernweh', definition: 'An ache for distant places; the opposite of homesickness.' },
  { term: 'Meraki', definition: 'μεράκι — Doing something with soul, creativity, and love.' },
  {
    term: 'Mono no aware',
    definition: '物の哀れ — The pathos of things; awareness of impermanence.',
  },
  { term: 'Jouissance', definition: 'Transgressive pleasure beyond the pleasure principle.' },
  { term: 'Bricolage', definition: 'Creating from a diverse range of available things.' },
  {
    term: 'Palimpsest',
    definition: 'Something reused or altered but still bearing traces of its earlier form.',
  },
  {
    term: 'Heterotopia',
    definition: 'Spaces of otherness; counter-sites that mirror and disturb real spaces.',
  },
  {
    term: 'Rhizome',
    definition: 'A non-hierarchical network of connections without beginning or end.',
  },
];
