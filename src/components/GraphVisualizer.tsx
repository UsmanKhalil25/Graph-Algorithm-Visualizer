import React from "react";

import { GraphNode } from "@/components/GraphNode";
import { GraphEdge } from "@/components/GraphEdge";

import { Node } from "@/types/node";
import { Edge } from "@/types/edge";

interface GraphVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  graphContainerRef: React.RefObject<HTMLDivElement>;
}

export function GraphVisualizer({
  nodes,
  edges,
  onClick,
  graphContainerRef,
}: GraphVisualizerProps) {
  return (
    <div
      ref={graphContainerRef}
      className="relative w-full h-full col-span-2 border-r-2"
      onClick={onClick}
    >
      {edges.map((edge, index) => {
        const fromNode = nodes.find((node) => node.id === edge.from);
        const toNode = nodes.find((node) => node.id === edge.to);

        if (!fromNode || !toNode) return null;

        return (
          <GraphEdge
            key={index}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            weight={edge.weight}
          />
        );
      })}

      {nodes.map((node) => (
        <GraphNode key={node.id} x={node.x} y={node.y}>
          {node.label}
        </GraphNode>
      ))}
    </div>
  );
}
