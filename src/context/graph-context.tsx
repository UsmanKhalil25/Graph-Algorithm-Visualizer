import { createContext, useState, ReactNode, useRef } from "react";
import { Node } from "@/types/node";
import { Edge } from "@/types/edge";

import { State } from "@/utils/constants";

type GraphContextType = {
  nodes: Node[];
  edges: Edge[];
  startingNode: Node | null;
  positioningNode: boolean;
  graphContainerRef: React.RefObject<HTMLDivElement>;
  mousePosition: { x: number; y: number } | null;
  currentEdge: Edge | null;
  currentState: State;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  addNode: (node: Node) => void;
  removeNode: (nodeId: number) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: number) => void;
  setStartingNode: React.Dispatch<React.SetStateAction<Node | null>>;
  setPositioningNode: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >;
  setCurrentEdge: React.Dispatch<React.SetStateAction<Edge | null>>;
  setCurrentState: React.Dispatch<React.SetStateAction<State>>;
};

export const GraphContext = createContext<GraphContextType | undefined>(
  undefined
);

export const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [startingNode, setStartingNode] = useState<Node | null>(null);
  const [positioningNode, setPositioningNode] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);
  const [currentState, setCurrentState] = useState<State>(State.Input);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  const addNode = (node: Node) => {
    setNodes((prevNodes) => [...prevNodes, node]);
  };

  const removeNode = (nodeId: number) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId)
    );
  };

  const addEdge = (edge: Edge) => {
    setEdges((prevEdges) => [...prevEdges, edge]);
  };

  const removeEdge = (edgeId: number) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
  };

  return (
    <GraphContext.Provider
      value={{
        nodes,
        edges,
        startingNode,
        positioningNode,
        graphContainerRef,
        mousePosition,
        currentEdge,
        currentState,
        setEdges,
        addNode,
        removeNode,
        addEdge,
        removeEdge,
        setStartingNode,
        setPositioningNode,
        setMousePosition,
        setCurrentEdge,
        setCurrentState,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
