import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { NodeInputForm } from "@/components/NodeInputForm";
import { EdgeInputForm } from "@/components/EdgeInputForm";
import { Node } from "@/types/node";
import { Edge } from "@/types/edge";
import { generateNodeId } from "@/utils/generator";

const BellmanFordInput = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [newNodePosition, setNewNodePosition] = useState({ x: 0, y: 0 });
    const [isNodePlacementReady, setIsNodePlacementReady] = useState(false);
    const [isRunningBellman, setIsRunningBellman] = useState(false);
    const [startingNode, setStartingNode] = useState<string | null>(null);

    const [bellmanResults, setBellmanResults] = useState<any[]>([]);

    const [currentEdgeIndex, setCurrentEdgeIndex] = useState(0);
   
  
    const [bellmanState, setBellmanState] = useState<{
        distances: Record<number, number>;
        previous: Record<number, number | null>;
    } | null>(null);

    const [iteration, setIteration] = useState(0);

    const graphContainerRef = useRef<HTMLDivElement>(null);

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
    }

    const handleVisualizerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = graphContainerRef.current;
        if (!container) return;

        const { offsetX, offsetY } = e.nativeEvent;
        setNewNodePosition({ x: offsetX, y: offsetY });
        setIsNodePlacementReady(true);
    };

    const handleStartAlgorithm = () => {
        if (!startingNode) return;

        const startNodeId = parseInt(startingNode, 10);
        const initialDistances: Record<number, number> = {};
        const initialPrevious: Record<number, number | null> = {};

        nodes.forEach((node) => {
        initialDistances[node.id] = Infinity;
        initialPrevious[node.id] = null;
        });

        initialDistances[startNodeId] = 0;
        setBellmanResults([]);
        setIteration(0);
        setBellmanState({ distances: initialDistances, previous: initialPrevious });
        setIsRunningBellman(true);
        setCurrentEdgeIndex(0)
    };

    const handleNextIteration = () => {
        
        if(bellmanState){
            const { distances, previous } = bellmanState;


            // Step 1: Check for self-loop weights
            if (iteration === 0) {
                nodes.forEach((node) => {
                const selfLoopEdge = edges.find(
                    (edge) => edge.from === node.id && edge.to === node.id
                );
                if (selfLoopEdge) {
                    distances[node.id] = Math.min(distances[node.id], selfLoopEdge.weight);
                }
                });
            }

            // Step 2: Process edges for the current iteration
            const currentEdge = edges[currentEdgeIndex];
            console.log("not in if")
            if (currentEdge) {
                console.log("in if statement")
                const { from, to, weight } = currentEdge;

                // Relax the edge
                if (distances[from] + weight < distances[to]) {
                distances[to] = distances[from] + weight;
                previous[to] = from;
                }

                // Save the result for the current iteration, editing the previous row
                const updatedBellmanResults = [...bellmanResults];
                updatedBellmanResults[iteration] = {
                iteration,
                edgeProcessed: currentEdge.id,
                distances: { ...distances },
                };

                setBellmanResults(updatedBellmanResults);

                setCurrentEdgeIndex((prev) => prev + 1); // Move to the next edge

                // // If all edges are processed, move to the next iteration
                // console.log(`current edge index ${currentEdgeIndex}`)
                // console.log(`edge length is ${edges}`)
                // if (currentEdgeIndex >= edges.length) {
                // setCurrentEdgeIndex(0); // Reset edge index
                // setIteration((prev) => prev + 1); // Increment the iteration

                // // Check if the current iteration's distances match the previous iteration's distances
                // const previousResults = bellmanResults[iteration - 1]?.distances;
                // console.log(previousResults)
                // console.log(distances)
                // if (previousResults && JSON.stringify(distances) === JSON.stringify(previousResults)) {
                //     // Stop the algorithm if results are the same
                //     setIsRunningBellman(false);
                //     return;
                // }

                // // Stop the algorithm if max iterations are reached
                // if (iteration >= nodes.length - 1) {
                //     setIsRunningBellman(false);
                // }
                // }
            }else{
                alert("Algorithm ended")
                setIsRunningBellman(false);
            }

            setBellmanState({ distances, previous });
        }
    }
    

    return (
        <div className="relative w-full h-full p-4 grid grid-cols-3">
            <GraphVisualizer
                nodes={nodes}
                edges={edges}
                graphContainerRef={graphContainerRef}
                onClick={handleVisualizerClick}
            />

            <div className="w-full col-span-1 px-6 py-2 flex flex-col gap-6">
                {!isRunningBellman ? (
                <>
                    <NodeInputForm
                        isNodePlacementReady={isNodePlacementReady}
                        onSubmit={handleAddNode}
                    />
                    <EdgeInputForm edges={edges} setEdges={setEdges} nodes={nodes} graphType="bellmanFord"/>
                    <label>Select Starting Node:</label>
                    <select
                        onChange={(e) => setStartingNode(e.target.value)}
                        className="p-2 border rounded text-black"
                    >
                        <option value="">Select a node</option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.label}
                            </option>
                        ))}
                    </select>
                    <Button onClick={() => handleStartAlgorithm()}>
                    Run Bellman-Ford
                    </Button>
                </>
                ) : (
                <>
                    <table className="table-auto border-collapse border border-gray-400">
                        <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Iteration</th>
                            {nodes.map((node) => (
                            <th key={node.id} className="border border-gray-300 px-4 py-2">
                                {node.label}
                            </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {bellmanResults.map((result, index) => (
                            <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{result.currentEdgeIndex}</td>
                            {nodes.map((node) => (
                                <td key={node.id} className="border border-gray-300 px-4 py-2">
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
                    
                    <Button
                    onClick={() =>
                        handleNextIteration()
                    }
                    >
                    Next Iteration
                    </Button>
                </>
                )}
            </div>
        </div>
    );
};

export default BellmanFordInput;
