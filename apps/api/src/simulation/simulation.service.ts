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

interface Graph {
  [key: string]: { [key: string]: number };
}

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  /**
   * Translates React Flow nodes/edges into an adjacency list for Dijkstra
   * Skips links that have been blocked by STP.
   */
  buildGraph(nodes: Node[], edges: Edge[], blockedEdges: Set<string> = new Set()): Graph {
    const graph: Graph = {};

    nodes.forEach((node) => {
      graph[node.id] = {};
    });

    edges.forEach((edge) => {
      // Ignore Spanning Tree blocked ports (to prevent routing loops)
      if (blockedEdges.has(edge.id)) return;

      // Default weight is 1, but can be latency-based
      const weight = edge.data?.latency || 1;
      
      if (graph[edge.source]) {
        graph[edge.source][edge.target] = weight;
      }
      
      // Assuming bidirectional links (Ethernet/Switch style) unless specified
      if (graph[edge.target]) {
        graph[edge.target][edge.source] = weight;
      }
    });

    return graph;
  }

  /**
   * Standard Dijkstra shortest path algorithm
   */
  findShortestPath(graph: Graph, startNode: string, endNode: string): string[] | null {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const nodes = new Set(Object.keys(graph));

    for (const node of nodes) {
      distances[node] = Infinity;
      previous[node] = null;
    }

    distances[startNode] = 0;

    while (nodes.size > 0) {
      const closestNode = Array.from(nodes).reduce((minNode, node) =>
        distances[node] < distances[minNode] ? node : minNode
      );

      if (distances[closestNode] === Infinity) break;
      if (closestNode === endNode) break;

      nodes.delete(closestNode);

      for (const neighbor in graph[closestNode]) {
        const alt = distances[closestNode] + graph[closestNode][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = closestNode;
        }
      }
    }

    const path: string[] = [];
    let curr: string | null = endNode;
    
    if (previous[curr] === null && curr !== startNode) return null;

    while (curr !== null) {
      path.unshift(curr);
      curr = previous[curr];
    }

    return path;
  }

  /**
   * Simulates a packet traversal with hop-by-hop analysis
   */
  async simulateTraversal(nodes: Node[], edges: Edge[], startId: string, endId: string, blockedEdges: Set<string> = new Set()) {
    const graph = this.buildGraph(nodes, edges, blockedEdges);
    const path = this.findShortestPath(graph, startId, endId);

    if (!path) {
      this.logger.warn(`No path found from ${startId} to ${endId}`);
      return { success: false, path: [] };
    }

    this.logger.log(`Simulation path: ${path.join(' -> ')}`);
    return { success: true, path };
  }
}
