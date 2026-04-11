import { Injectable, Logger } from '@nestjs/common';

interface Node {
  id: string;
  data: any;
  type: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  data?: any;
}

@Injectable()
export class StpService {
  private readonly logger = new Logger(StpService.name);

  /**
   * Calculates the Spanning Tree and returns a list of edge IDs that should be blocked
   * to prevent layer 2 broadcast storms.
   */
  calculateSpanningTree(nodes: Node[], edges: Edge[]): string[] {
    const blockedEdges = new Set<string>();

    // 1. Identify participating STP devices (Switches AND Hubs)
    const stpDevices = nodes.filter(n => n.type === 'switch' || n.type === 'hub');
    if (stpDevices.length === 0) return [];
    
    // Sort deterministically to elect Root Bridge (lowest ID = Root)
    stpDevices.sort((a, b) => a.id.localeCompare(b.id));
    const rootBridge = stpDevices[0];

    // 2. Build L2 Adjacency List
    const adj = new Map<string, Array<{ target: string, edgeId: string }>>();
    nodes.forEach(n => adj.set(n.id, []));

    edges.forEach(e => {
      const sourceNode = nodes.find(n => n.id === e.source);
      const targetNode = nodes.find(n => n.id === e.target);
      
      // We only care about links forming loops between L2 devices
      if ((sourceNode?.type === 'switch' || sourceNode?.type === 'hub') && 
          (targetNode?.type === 'switch' || targetNode?.type === 'hub')) {
        adj.get(e.source)?.push({ target: e.target, edgeId: e.id });
        adj.get(e.target)?.push({ target: e.source, edgeId: e.id });
      }
    });

    // 3. BFS from Root Bridge (Path Vector algorithm approximation)
    const visited = new Set<string>();
    visited.add(rootBridge.id);
    
    const queue = [rootBridge.id];
    const treeEdges = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = adj.get(current) || [];
      
      // Sort neighbors by ID to always break ties predictably
      neighbors.sort((a, b) => a.target.localeCompare(b.target));

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.target)) {
          visited.add(neighbor.target);
          treeEdges.add(neighbor.edgeId);
          queue.push(neighbor.target);
        } else if (!treeEdges.has(neighbor.edgeId)) {
          // Both nodes visited but this edge is not part of the primary spanning tree
          // -> Redundant Path -> Blocked
          blockedEdges.add(neighbor.edgeId);
        }
      }
    }

    return Array.from(blockedEdges);
  }
}
