import { randomBetween, type RandomSource } from '../random';

/**
 * KNOWLEDGE GRAPH — a miniature force-directed layout.
 *
 * Sixteen concepts across four faculties, laid out by a three-force
 * simulation running at frame rate:
 *
 *   1. **Centre gravity** — a weak spring toward the middle keeps the graph
 *      from drifting out of frame.
 *   2. **Inverse-square repulsion** — every pair pushes apart, which is what
 *      actually produces the readable spacing.
 *   3. **Pointer attraction** — nodes within `POINTER_RADIUS` lean toward the
 *      cursor, so the graph feels alive under the hand.
 *
 * Velocities are damped each tick, so the system settles instead of ringing.
 * Sixteen nodes means the O(n²) pass is ~120 pair tests per frame: cheap
 * enough that no spatial index is warranted.
 */

export interface GraphCategory {
  name: string;
  color: string;
  nodes: readonly string[];
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  /** Velocity, in pixels per tick. */
  vx: number;
  vy: number;
  category: string;
  /** Drawing radius in pixels. */
  size: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** The four faculties, and the concepts that belong to each. */
export const GRAPH_CATEGORIES: readonly GraphCategory[] = [
  { name: 'Philosophy', color: '#ff6b6b', nodes: ['Ontology', 'Ethics', 'Aesthetics', 'Logic'] },
  { name: 'Science', color: '#4ecdc4', nodes: ['Physics', 'Biology', 'Chemistry', 'Complexity'] },
  { name: 'Art', color: '#ffe66d', nodes: ['Music', 'Visual', 'Literature', 'Cinema'] },
  { name: 'Tech', color: '#a855f7', nodes: ['AI', 'Crypto', 'Biotech', 'Quantum'] },
];

/** Probability that any two concepts in the same faculty are linked. */
const INTRA_CATEGORY_LINK_PROBABILITY = 0.6;

/** Number of cross-faculty links attempted — the interesting ones. */
const INTER_CATEGORY_LINK_ATTEMPTS = 8;

export const SIMULATION_DEFAULTS = {
  width: 360,
  height: 260,
  /** Spring constant pulling nodes toward the centre. */
  gravity: 0.0005,
  /** Numerator of the inverse-square repulsion term. */
  repulsion: 50,
  /** Scales repulsion into velocity units. */
  repulsionScale: 0.01,
  /** Velocity retained per tick; below 1 the system loses energy. */
  damping: 0.95,
  /** Distance within which the pointer attracts nodes. */
  pointerRadius: 80,
  /** Strength of that attraction. */
  pointerStrength: 0.001,
  /** Keep-out margin from the canvas edges. */
  padding: 20,
} as const;

/** Look up a faculty's accent colour by name. */
export function categoryColor(name: string): string {
  return GRAPH_CATEGORIES.find((category) => category.name === name)?.color ?? '#ffffff';
}

/**
 * Build the initial graph: nodes seeded on a jittered ellipse (so the
 * simulation starts from a spread-out state rather than a singularity) plus
 * intra- and inter-faculty edges.
 */
export function createKnowledgeGraph(
  options: { width?: number; height?: number; random?: RandomSource } = {},
): KnowledgeGraph {
  const {
    width = SIMULATION_DEFAULTS.width,
    height = SIMULATION_DEFAULTS.height,
    random = Math.random,
  } = options;

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const totalSlots = GRAPH_CATEGORIES.length * 4;

  GRAPH_CATEGORIES.forEach((category, categoryIndex) => {
    category.nodes.forEach((name, nodeIndex) => {
      const angle =
        ((categoryIndex * category.nodes.length + nodeIndex) / totalSlots) * Math.PI * 2;

      nodes.push({
        id: name,
        x: width / 2 + Math.cos(angle) * randomBetween(60, 120, random),
        y: height / 2 + Math.sin(angle) * randomBetween(40, 80, random),
        vx: 0,
        vy: 0,
        category: category.name,
        size: randomBetween(3, 7, random),
      });
    });

    for (let i = 0; i < category.nodes.length; i++) {
      for (let j = i + 1; j < category.nodes.length; j++) {
        if (random() < INTRA_CATEGORY_LINK_PROBABILITY) {
          edges.push({ source: category.nodes[i], target: category.nodes[j] });
        }
      }
    }
  });

  for (let attempt = 0; attempt < INTER_CATEGORY_LINK_ATTEMPTS; attempt++) {
    const a = nodes[Math.floor(random() * nodes.length)];
    const b = nodes[Math.floor(random() * nodes.length)];
    if (a.category !== b.category) {
      edges.push({ source: a.id, target: b.id });
    }
  }

  return { nodes, edges };
}

export interface SimulationStepOptions {
  width?: number;
  height?: number;
  /** Pointer position in canvas coordinates, or `null` when outside. */
  pointer?: { x: number; y: number } | null;
}

/**
 * Advance the simulation by one tick, mutating `nodes` in place.
 *
 * Mutation is deliberate: the loop runs every animation frame and the node
 * array is owned by a ref, so allocating a fresh array 60 times a second would
 * be pure garbage-collector pressure for no benefit.
 */
export function stepForceSimulation(
  nodes: GraphNode[],
  {
    width = SIMULATION_DEFAULTS.width,
    height = SIMULATION_DEFAULTS.height,
    pointer = null,
  }: SimulationStepOptions = {},
): void {
  const { gravity, repulsion, repulsionScale, damping, pointerRadius, pointerStrength, padding } =
    SIMULATION_DEFAULTS;

  // Phase 1 — accumulate forces into velocities.
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    node.vx += (width / 2 - node.x) * gravity;
    node.vy += (height / 2 - node.y) * gravity;

    for (let j = i + 1; j < nodes.length; j++) {
      const other = nodes[j];
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      // Guard against coincident nodes: a zero distance would divide by zero
      // and fling both nodes to infinity.
      const distance = Math.hypot(dx, dy) || 1;
      const force = (repulsion / (distance * distance)) * repulsionScale;

      node.vx += dx * force;
      node.vy += dy * force;
      other.vx -= dx * force;
      other.vy -= dy * force;
    }

    if (pointer) {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      if (Math.hypot(dx, dy) < pointerRadius) {
        node.vx += dx * pointerStrength;
        node.vy += dy * pointerStrength;
      }
    }
  }

  // Phase 2 — integrate, damp, and keep everything inside the frame.
  for (const node of nodes) {
    node.vx *= damping;
    node.vy *= damping;
    node.x = Math.min(width - padding, Math.max(padding, node.x + node.vx));
    node.y = Math.min(height - padding, Math.max(padding, node.y + node.vy));
  }
}

/** Nearest node to a point, within `radius`; `null` if nothing is close. */
export function findNodeAt(
  nodes: readonly GraphNode[],
  point: { x: number; y: number },
  radius = 12,
): GraphNode | null {
  let best: GraphNode | null = null;
  let bestDistance = radius;

  for (const node of nodes) {
    const distance = Math.hypot(node.x - point.x, node.y - point.y);
    if (distance <= bestDistance) {
      best = node;
      bestDistance = distance;
    }
  }

  return best;
}
