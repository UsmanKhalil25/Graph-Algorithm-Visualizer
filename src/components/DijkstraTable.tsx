import { useState, useEffect, useContext } from "react";
import { GraphContext } from "@/context/graph-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Button } from "./ui/button";
import { Edge } from "@/types/edge";

export function DijkstraTable() {
  const graphContext = useContext(GraphContext);
  if (!graphContext) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }

  const { edges, nodes, startingNode, setEdges } = graphContext;

  const [iterations, setIterations] = useState<
    Array<{
      step: number;
      nodeState: Record<number, number>;
      previousState: Record<number, number | null>;
      currentEdge: Edge | null;
    }>
  >([]);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [shortestEdges, setShortestEdges] = useState<Edge[]>([]);

  const runDijkstra = (startNodeId: number) => {
    const distances: Record<number, number> = {};
    const previous: Record<number, number | null> = {};
    const visited: Set<number> = new Set();
    const unvisited: Set<number> = new Set(nodes.map((node) => node.id));

    nodes.forEach((node) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[startNodeId] = 0;

    const iterations: Array<{
      step: number;
      nodeState: Record<number, number>;
      previousState: Record<number, number | null>;
      currentEdge: Edge | null;
    }> = [];

    let step = 0;

    const processIteration = () => {
      if (unvisited.size === 0) {
        return;
      }

      if (unvisited.size === 1) {
        const shortest: Edge[] = [];
        nodes.forEach((node) => {
          const prevNodeId = previous[node.id];
          if (prevNodeId !== null) {
            const edge = edges.find(
              (e) =>
                (e.from === node.id && e.to === prevNodeId) ||
                (e.to === node.id && e.from === prevNodeId)
            );
            if (edge) {
              shortest.push(edge);
            }
          }
        });
        setShortestEdges(shortest);
      }

      const currentNodeId = Array.from(unvisited).reduce(
        (minNodeId, nodeId) =>
          distances[nodeId] < distances[minNodeId] ? nodeId : minNodeId,
        Array.from(unvisited)[0]
      );

      console.log("Processing node:", currentNodeId);

      unvisited.delete(currentNodeId);
      visited.add(currentNodeId);

      let currentEdge: Edge | null = null;

      edges
        .filter(
          (edge) => edge.from === currentNodeId || edge.to === currentNodeId
        )
        .forEach((edge) => {
          const neighborId = edge.from === currentNodeId ? edge.to : edge.from;
          if (visited.has(neighborId)) return;

          const alt = distances[currentNodeId] + edge.weight;
          if (alt < distances[neighborId]) {
            distances[neighborId] = alt;
            previous[neighborId] = currentNodeId;
            currentEdge = edge;
          }
        });

      iterations.push({
        step,
        nodeState: { ...distances },
        previousState: { ...previous },
        currentEdge,
      });

      step++;
      setIterations([...iterations]);

      if (unvisited.size > 0) {
        setTimeout(processIteration, 500);
      }
    };

    processIteration();

    return iterations;
  };
  useEffect(() => {
    if (shortestEdges.length > 0 && currentStep >= iterations.length - 1) {
      setEdges(shortestEdges);
    }
  }, [shortestEdges, currentStep]);

  useEffect(() => {
    if (startingNode) {
      runDijkstra(startingNode.id);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < iterations.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="w-full py-10 px-4 bg-muted/40 h-screen overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Step</TableHead>
            <TableHead>Node Label</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Previous Node</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {iterations
            .filter((iteration) => iteration.step <= currentStep)
            .map((iteration) => (
              <React.Fragment key={iteration.step}>
                {nodes.map((node, index) => (
                  <TableRow
                    key={node.id}
                    className="border-t border-b border-gray-600"
                  >
                    {index === 0 && (
                      <TableCell rowSpan={nodes.length}>
                        {iteration.step}
                      </TableCell>
                    )}
                    <TableCell>{node.label}</TableCell>
                    <TableCell>{iteration.nodeState[node.id]}</TableCell>
                    <TableCell>
                      {iteration.previousState[node.id] !== null
                        ? nodes.find(
                            (n) => n.id === iteration.previousState[node.id]
                          )?.label
                        : "None"}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
        </TableBody>
      </Table>

      <div style={{ marginTop: "20px" }}>
        <Button
          onClick={handleNext}
          disabled={currentStep >= iterations.length - 1}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor:
              currentStep < iterations.length - 1 ? "pointer" : "not-allowed",
          }}
        >
          {currentStep >= iterations.length - 1 ? "Completed" : "Next Step"}
        </Button>
      </div>
    </div>
  );
}
