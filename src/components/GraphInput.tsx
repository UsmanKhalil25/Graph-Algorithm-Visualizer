import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { NodeInputForm } from "@/components/NodeInputForm";
import { EdgeInputForm } from "@/components/EdgeInputForm";

import { Node } from "@/types/node";
import { Edge } from "@/types/edge";
import { generateNodeId } from "@/utils/generator";

const GraphInput = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [newNodePosition, setNewNodePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isNodePlacementReady, setIsNodePlacementReady] = useState(false);

  const [isRunningDijkstra, setIsRunningDijkstra] = useState(false);
  const [dijkstraResults, setDijkstraResults] = useState<any[]>([]);
  const [startingNode, setStartingNode] = useState<string | null>(null);
  const [iteration, setIteration] = useState(0);
  const [dijkstraState, setDijkstraState] = useState<{
    distances: Record<number, number>;
    previous: Record<number, number | null>;
    visited: Set<number>;
    priorityQueue: Array<{ nodeId: number; distance: number }>;
  } | null>(null);

  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleStartDijkstra();
  }, [startingNode]);

  const handleAddNode = (nodeLabel: string) => {
    if (!nodeLabel) return;

    const newNode: Node = {
      id: generateNodeId.next().value!,
      label: nodeLabel,
      x: newNodePosition.x,
      y: newNodePosition.y,
    };

    setNodes([...nodes, newNode]);
    setIsNodePlacementReady(false);
  };

  const handleVisualizerClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const container = graphContainerRef.current;
    if (!container) return;

    const { offsetX, offsetY } = e.nativeEvent;

    setNewNodePosition({ x: offsetX, y: offsetY });
    setIsNodePlacementReady(true);
  };

  const handleStartDijkstra = () => {
    if (!startingNode) return;

    const startNodeId = parseInt(startingNode, 10);

    const initialDistances: Record<number, number> = {};
    const initialPrevious: Record<number, number | null> = {};
    const initialVisited = new Set<number>();

    nodes.forEach((node) => {
      initialDistances[node.id] = Infinity;
      initialPrevious[node.id] = null;
    });

    initialDistances[startNodeId] = 0;

    setDijkstraResults([]);
    setIteration(0);

    const initialPriorityQueue = [{ nodeId: startNodeId, distance: 0 }];
    setDijkstraState({
      distances: initialDistances,
      previous: initialPrevious,
      visited: initialVisited,
      priorityQueue: initialPriorityQueue,
    });
  };

  const handleNextDijkstraIteration = () => {
    if (!dijkstraState) {
      setIsRunningDijkstra(false);
      return;
    }

    const { distances, previous, visited, priorityQueue } = dijkstraState;

    if (priorityQueue.length === 0) {
      setIsRunningDijkstra(false);
      return;
    }

    // Sort and process the next node
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { nodeId: currentNode } = priorityQueue.shift()!;

    if (visited.has(currentNode)) return;

    visited.add(currentNode);

    edges
      .filter((edge) => edge.from === currentNode && !visited.has(edge.to))
      .forEach((edge) => {
        const newDistance = distances[currentNode] + edge.weight;
        if (newDistance < distances[edge.to]) {
          distances[edge.to] = newDistance;
          previous[edge.to] = currentNode;
          priorityQueue.push({ nodeId: edge.to, distance: newDistance });
        }
      });

    setDijkstraResults((prevResults) => [
      ...prevResults,
      { iteration: iteration + 1, distances: { ...distances } },
    ]);

    setIteration((prev) => prev + 1);
    setDijkstraState({ distances, previous, visited, priorityQueue });
  };

  return (
    <div className="relative w-full h-full p-4 grid grid-cols-3">
      <GraphVisualizer
        nodes={nodes}
        edges={edges}
        graphContainerRef={graphContainerRef}
        onClick={handleVisualizerClick}
      />

      <div className="w-full col-span-1 px-6 py-2 flex flex-col gap-6">
        {!isRunningDijkstra ? (
          <>
            <NodeInputForm
              isNodePlacementReady={isNodePlacementReady}
              onSubmit={handleAddNode}
            />
            <EdgeInputForm edges={edges} setEdges={setEdges} nodes={nodes} />
            <Button onClick={() => setIsRunningDijkstra(true)}>
              Run Dijkstra
            </Button>
          </>
        ) : !startingNode ? (
          <>
            <label>Select Starting Node:</label>
            <select
              onChange={(e) => setStartingNode(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select a node</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <div className="overflow-x-auto">
            <>
              <table className="table-auto border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Iteration
                    </th>
                    {nodes.map((node) => (
                      <th
                        key={node.id}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {node.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dijkstraResults.map((result, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {result.iteration}
                      </td>
                      {nodes.map((node) => (
                        <td
                          key={node.id}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {result.distances[node.id] !== undefined
                            ? result.distances[node.id] === Infinity
                              ? "∞"
                              : result.distances[node.id]
                            : "∞"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button onClick={handleNextDijkstraIteration}>Next</Button>
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphInput;
