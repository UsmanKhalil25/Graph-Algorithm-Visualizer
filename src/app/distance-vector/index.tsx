import { useContext } from "react";

import { GraphInput } from "@/components/GraphInput";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { BellmanFordTable } from "@/components/BellmanFordTable";

import { Algorithm, State } from "@/utils/constants";
import { GraphContext } from "@/context/graph-context";

export default function DistanceVectorPage() {
  const graphContext = useContext(GraphContext);

  if (!graphContext) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }

  const { currentState, setCurrentState } = graphContext;
  const handleRunDijkstra = () => {
    setCurrentState(State.Running);
  };

  return (
    <div className="h-screen w-full grid grid-cols-3">
      <GraphVisualizer />
      {currentState === State.Input ? (
        <GraphInput
          algorithm={Algorithm.BellmanFord}
          onStartAlgorithm={handleRunDijkstra}
        />
      ) : (
        <BellmanFordTable />
      )}
    </div>
  );
}
