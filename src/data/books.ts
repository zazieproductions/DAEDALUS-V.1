/** A single volume in BIBLIOTHECA UNIVERSALIS. */
export interface Book {
  title: string;
  author: string;
  /** Year of first publication (negative values would denote BCE). */
  year: number;
  /** Free-form discipline tag; the library derives its filter chips from these. */
  field: string;
}

/**
 * The shelf.
 *
 * Chosen for cross-disciplinary reach rather than canon: each entry is a book
 * that reframes an entire field, which is the through-line of the whole OS.
 * Titles are unique — the library uses them as React keys.
 */
export const BOOKSHELF: readonly Book[] = [
  { title: 'Gödel, Escher, Bach', author: 'Hofstadter', year: 1979, field: 'metamathematics' },
  { title: 'A Thousand Plateaus', author: 'Deleuze & Guattari', year: 1980, field: 'philosophy' },
  {
    title: 'The Structure of Scientific Revolutions',
    author: 'Kuhn',
    year: 1962,
    field: 'epistemology',
  },
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

/** Titles starred on first run, as an opinionated starting point. */
export const DEFAULT_FAVOURITE_TITLES: readonly string[] = ['Gödel, Escher, Bach', 'Pale Fire'];
