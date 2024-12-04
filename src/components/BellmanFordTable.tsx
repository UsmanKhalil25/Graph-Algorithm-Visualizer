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

export function BellmanFordTable() {
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
    }>
  >([]);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [shortestEdges, setShortestEdges] = useState<Edge[]>([]);

  const runBellmanFord = (startNodeId: number) => {
    const distances: Record<number, number> = {};
    const previous: Record<number, number | null> = {};
    const iterations: Array<{
      step: number;
      nodeState: Record<number, number>;
      previousState: Record<number, number | null>;
    }> = [];

    // Initialize distances
    nodes.forEach((node) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[startNodeId] = 0;

    let step = 0;

    // Relax all edges V-1 times
    const processIteration = () => {
      let updated = false;
      edges.forEach((edge) => {
        const alt = distances[edge.from] + edge.weight;
        if (alt < distances[edge.to]) {
          distances[edge.to] = alt;
          previous[edge.to] = edge.from;
          updated = true;
        }
        const altReverse = distances[edge.to] + edge.weight;
        if (altReverse < distances[edge.from]) {
          distances[edge.from] = altReverse;
          previous[edge.from] = edge.to;
          updated = true;
        }
      });

      iterations.push({
        step,
        nodeState: { ...distances },
        previousState: { ...previous },
      });

      step++;
      setIterations([...iterations]);

      // If there were updates, continue processing
      if (updated) {
        setTimeout(processIteration, 500);
      } else {
        // No updates means we are done
        setShortestEdges(
          nodes
            .map((node) => {
              const prevNodeId = previous[node.id];
              if (prevNodeId !== null) {
                return edges.find(
                  (e) =>
                    (e.from === node.id && e.to === prevNodeId) ||
                    (e.to === node.id && e.from === prevNodeId)
                );
              }
              return null;
            })
            .filter((edge): edge is Edge => edge !== null)
        );
      }
    };

    processIteration();
  };

  useEffect(() => {
    if (startingNode) {
      runBellmanFord(startingNode.id);
    }
  }, []);

  useEffect(() => {
    if (shortestEdges.length > 0 && currentStep >= iterations.length - 1) {
      setEdges(shortestEdges);
    }
  }, [shortestEdges, currentStep]);

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
