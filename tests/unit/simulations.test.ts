import { describe, expect, it } from 'vitest';

import {
  createKnowledgeGraph,
  findNodeAt,
  GRAPH_CATEGORIES,
  SIMULATION_DEFAULTS,
  stepForceSimulation,
} from '@/lib/simulations/force-graph';
import {
  createSynapseField,
  CORTEX_LABELS,
  synapseLinkOpacity,
  SYNAPSE_LINK_DISTANCE,
} from '@/lib/simulations/synapse-field';

describe('synapse field', () => {
  const field = createSynapseField({ width: 400, height: 280, random: () => 0.5 });

  it('places one node per discipline', () => {
    expect(field).toHaveLength(CORTEX_LABELS.length);
    expect(field.map((node) => node.label)).toEqual([...CORTEX_LABELS]);
  });

  it('lays nodes out around the centre of the canvas', () => {
    const centres = field.map((node) => Math.hypot(node.x - 200, node.y - 140));
    for (const distance of centres) {
      expect(distance).toBeGreaterThanOrEqual(80);
      expect(distance).toBeLessThanOrEqual(120.001);
    }
  });

  it('fades links to nothing at the cutoff distance', () => {
    expect(synapseLinkOpacity(SYNAPSE_LINK_DISTANCE, 0, 0)).toBe(0);
    expect(synapseLinkOpacity(SYNAPSE_LINK_DISTANCE + 50, 0, 0)).toBe(0);
    expect(synapseLinkOpacity(0, Math.PI / 2, 0)).toBeGreaterThan(0);
  });

  it('never exceeds the documented maximum opacity', () => {
    for (let distance = 0; distance < 260; distance += 7) {
      for (let time = 0; time < 6; time += 0.3) {
        const alpha = synapseLinkOpacity(distance, time, 3);
        expect(alpha).toBeGreaterThanOrEqual(0);
        expect(alpha).toBeLessThanOrEqual(0.3);
      }
    }
  });
});

describe('knowledge graph', () => {
  it('creates one node per concept across all faculties', () => {
    const { nodes } = createKnowledgeGraph({ random: () => 0.5 });
    const expected = GRAPH_CATEGORIES.reduce((total, c) => total + c.nodes.length, 0);

    expect(nodes).toHaveLength(expected);
    expect(new Set(nodes.map((node) => node.id)).size).toBe(expected);
  });

  it('only ever links nodes that exist', () => {
    const { nodes, edges } = createKnowledgeGraph();
    const ids = new Set(nodes.map((node) => node.id));

    for (const edge of edges) {
      expect(ids.has(edge.source)).toBe(true);
      expect(ids.has(edge.target)).toBe(true);
      expect(edge.source).not.toBe(edge.target);
    }
  });

  it('keeps every node inside the padded frame, however long it runs', () => {
    const { width, height, padding } = SIMULATION_DEFAULTS;
    const { nodes } = createKnowledgeGraph();

    for (let tick = 0; tick < 600; tick++) stepForceSimulation(nodes);

    for (const node of nodes) {
      expect(node.x).toBeGreaterThanOrEqual(padding);
      expect(node.x).toBeLessThanOrEqual(width - padding);
      expect(node.y).toBeGreaterThanOrEqual(padding);
      expect(node.y).toBeLessThanOrEqual(height - padding);
      expect(Number.isFinite(node.x)).toBe(true);
    }
  });

  it('survives perfectly coincident nodes without dividing by zero', () => {
    const nodes = [
      { id: 'a', x: 100, y: 100, vx: 0, vy: 0, category: 'Art', size: 4 },
      { id: 'b', x: 100, y: 100, vx: 0, vy: 0, category: 'Tech', size: 4 },
    ];

    stepForceSimulation(nodes);

    expect(Number.isFinite(nodes[0].x)).toBe(true);
    expect(Number.isFinite(nodes[1].y)).toBe(true);
  });

  it('settles: total kinetic energy decays once the pointer leaves', () => {
    const { nodes } = createKnowledgeGraph();
    const energy = () => nodes.reduce((sum, n) => sum + n.vx * n.vx + n.vy * n.vy, 0);

    for (let tick = 0; tick < 50; tick++) stepForceSimulation(nodes);
    const early = energy();
    for (let tick = 0; tick < 500; tick++) stepForceSimulation(nodes);

    expect(energy()).toBeLessThan(early);
  });

  it('finds the node under the pointer, and nothing when the pointer is far', () => {
    const nodes = [{ id: 'AI', x: 50, y: 50, vx: 0, vy: 0, category: 'Tech', size: 4 }];

    expect(findNodeAt(nodes, { x: 52, y: 52 })?.id).toBe('AI');
    expect(findNodeAt(nodes, { x: 300, y: 300 })).toBeNull();
  });
});
