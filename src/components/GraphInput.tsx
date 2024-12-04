import { Button } from "@/components/ui/button";

import { NodeInputForm } from "@/components/NodeInputForm";
import { EdgeInputForm } from "@/components/EdgeInputForm";
import { StartingNodeInput } from "@/components/StartingNodeSelect";

import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import { GraphContext } from "@/context/graph-context";
import { Algorithm } from "@/utils/constants";

interface GraphInputProps {
  onStartAlgorithm: () => void;
  algorithm: Algorithm;
}

export function GraphInput({ onStartAlgorithm, algorithm }: GraphInputProps) {
  const { toast } = useToast();
  const graphContext = useContext(GraphContext);

  if (!graphContext) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }

  const { startingNode, nodes, edges } = graphContext;

  const handleStartAlgorithm = () => {
    if (!startingNode) {
      toast({
        title: "Error",
        description:
          "Please select a starting node before starting the algorithm.",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "Error",
        description: "There are no nodes available for Dijkstra.",
        variant: "destructive",
      });
      return;
    }

    if (edges.length === 0) {
      toast({
        title: "Error",
        description: "There are no edges available for Dijkstra.",
        variant: "destructive",
      });
      return;
    }
    onStartAlgorithm();
  };

  return (
    <div className="flex flex-col w-full justify-between py-10 px-4 bg-muted/40">
      <div className="w-full col-span-1 flex flex-col gap-4 justify-center items-start ">
        <NodeInputForm />
        <EdgeInputForm algorithm={algorithm} />
        <StartingNodeInput />
      </div>
      <Button onClick={handleStartAlgorithm}>{`Start ${
        algorithm === Algorithm.Dijkstra ? "Dijkstra" : "Bellman Ford"
      }  Algorithm`}</Button>
    </div>
  );
}
