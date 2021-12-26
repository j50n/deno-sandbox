// @deno-types="https://raw.githubusercontent.com/mourner/tinyqueue/v2.0.3/index.d.ts"
import TinyQueue from "https://raw.githubusercontent.com/mourner/tinyqueue/v2.0.3/index.js";

interface IEdge {
  node: number;
  weight: number;
}

interface IPath {
  node: number;
  weight: number;
}

/**
 * Implementation of Dijkstra's Shortest Path algorithm.
 *
 * Nodes are numbered from 0 to n-1.
 *
 * Adapted from https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026
 * This has been made more lightweight by treating nodes as an index rather than a string (name). We use `tinyqueue`
 * as our priority queue. All map-likes have been eliminated, but there are still object references in here, so
 * not as fast as possible, but should be fast enough and not too heavy on memory.
 */
export class DijkstraShortestPathSolver {
  public adjacencyList: IEdge[][];

  constructor(public nodes: number) {
    this.adjacencyList = new Array(nodes).fill(null).map((_v) => new Array(0));
  }

  addEdge(fromNode: number, toNode: number, weight: number): void {
    if (weight < 0) {
      throw new RangeError("weight must be >= 0");
    }
    this.adjacencyList[fromNode].push({ node: toNode, weight });
  }

  addBidirEdge(fromNode: number, toNode: number, weight: number): void {
    if (weight < 0) {
      throw new RangeError("weight must be >= 0");
    }
    this.adjacencyList[fromNode].push({ node: toNode, weight });
    this.adjacencyList[toNode].push({ node: fromNode, weight });
  }

  setEdges(node: number, edges: IEdge[]): void {
    this.adjacencyList[node] = edges;
  }

  /**
   * Calculate shortest paths for all nodes for the given start node.
   * @param startNode The start node.
   */
  calculateFor(startNode: number): ShortestPaths {
    const weights: number[] = new Array(this.nodes).fill(Infinity);
    weights[startNode] = 0;

    const pq = new TinyQueue<IPath>(
      [{ node: startNode, weight: 0 }],
      (a, b) => a.weight - b.weight,
    );

    const backtrace: number[] = new Array(this.nodes).fill(-1);

    while (pq.length !== 0) {
      const shortestStep = pq.pop();
      if(shortestStep === undefined){
          throw new Error("shortest-step undefined");
      }
      const currentNode = shortestStep.node;

      this.adjacencyList[currentNode].forEach((neighbor) => {
        const weight = weights[currentNode] + neighbor.weight;

        if (weight < weights[neighbor.node]) {
          weights[neighbor.node] = weight;
          backtrace[neighbor.node] = currentNode;
          pq.push({ node: neighbor.node, weight: weight });
        }
      });
    }

    return new ShortestPaths(startNode, backtrace, weights);
  }
}

class ShortestPaths {
  constructor(
    public startNode: number,
    public backtrace: number[],
    public weights: number[],
  ) {}

  /**
   * Find the shortest path to the given end node.
   * @param endNode The end node.
   */
  shortestPathTo(endNode: number): number[] {
    const path = [endNode];
    let lastStep = endNode;

    while (lastStep != this.startNode) {
      path.unshift(this.backtrace[lastStep]);
      lastStep = this.backtrace[lastStep];
    }

    return path;
  }

  /**
   * Total weight of the path from the start node to the given end node.
   * @param endNode The end node.
   */
  totalWeight(endNode: number): number {
    return this.weights[endNode];
  }
}

