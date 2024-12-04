import { useContext } from "react";
import { GraphNode } from "@/components/GraphNode";
import { GraphEdge } from "@/components/GraphEdge";
import { GraphContext } from "@/context/graph-context";

export function GraphVisualizer() {
  const graphContext = useContext(GraphContext);

  if (!graphContext) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }

  const {
    nodes,
    edges,
    graphContainerRef,
    positioningNode,
    setPositioningNode,
    setMousePosition,
  } = graphContext;

  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (graphContainerRef.current && positioningNode) {
      const rect = graphContainerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setPositioningNode(false);
    }
  };

  return (
    <div
      ref={graphContainerRef}
      onClick={handleMouseClick}
      className={`relative w-full h-full col-span-2 border-r-2 ${
        positioningNode ? "cursor-pointer" : ""
      }`}
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
            isSelfEdge={fromNode.id === toNode.id}
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
