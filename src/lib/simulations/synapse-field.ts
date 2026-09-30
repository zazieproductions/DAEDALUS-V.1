import { randomBetween, type RandomSource } from '../random';

/**
 * CORTEX MAPPER — the synapse field.
 *
 * A ring of twelve labelled disciplines, jittered in radius, drawn with
 * distance-attenuated connections. It is not a data visualisation: it is an
 * ambient claim that the disciplines are one substrate. The simulation is
 * kept pure and separate from the rendering so it can be reasoned about (and
 * unit-tested) without a canvas.
 */

export interface SynapseNode {
  /** Rest position — the renderer adds a small orbital wobble on top. */
  x: number;
  y: number;
  /** Core radius in pixels. */
  radius: number;
  /** Discipline abbreviation shown beneath the node. */
  label: string;
}

/** The twelve disciplines the OS considers load-bearing. */
export const CORTEX_LABELS: readonly string[] = [
  'ART',
  'MATH',
  'MUSIC',
  'CODE',
  'PHIL',
  'LIT',
  'BIO',
  'PHYS',
  'LING',
  'ARCH',
  'CHEM',
  'PSYCH',
];

export interface SynapseFieldOptions {
  /** Logical canvas size the field is laid out inside. */
  width?: number;
  height?: number;
  random?: RandomSource;
}

/**
 * Lay the disciplines out on a jittered circle centred in the canvas.
 *
 * Equal angular spacing keeps every label readable; the random radius stops
 * the result from looking like a clock face.
 */
export function createSynapseField(options: SynapseFieldOptions = {}): SynapseNode[] {
  const { width = 400, height = 280, random = Math.random } = options;
  const centerX = width / 2;
  const centerY = height / 2;

  return CORTEX_LABELS.map((label, index) => {
    const angle = (index / CORTEX_LABELS.length) * Math.PI * 2;
    const radius = randomBetween(80, 120, random);

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      radius: randomBetween(4, 12, random),
      label,
    };
  });
}

/** Distance beyond which two nodes are no longer drawn as connected. */
export const SYNAPSE_LINK_DISTANCE = 200;

/**
 * Opacity of the link between two nodes: linear falloff with distance,
 * modulated by a slow per-node sine so the field appears to breathe.
 *
 * @param distance  Euclidean distance between the two nodes.
 * @param time      Elapsed simulation time in arbitrary units.
 * @param nodeIndex Index of the source node, used to de-phase the pulse.
 * @returns Alpha in `[0, 0.3]`; `0` once the link exceeds the cutoff.
 */
export function synapseLinkOpacity(distance: number, time: number, nodeIndex: number): number {
  if (distance >= SYNAPSE_LINK_DISTANCE) return 0;
  const falloff = 1 - distance / SYNAPSE_LINK_DISTANCE;
  const pulse = 0.5 + 0.5 * Math.sin(time + nodeIndex * 0.5);
  return falloff * 0.3 * pulse;
}
