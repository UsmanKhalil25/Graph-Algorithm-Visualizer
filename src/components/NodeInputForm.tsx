import { useContext, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MousePointerClick } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";

import { GraphContext } from "@/context/graph-context";
import { generateNodeId } from "@/utils/generator";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nodeLabel: z.string().min(1, {
    message: "Node label must be at least 1 character.",
  }),
});

export function NodeInputForm() {
  const graphContext = useContext(GraphContext);
  const { toast } = useToast();

  if (!graphContext) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }

  const { addNode, positioningNode, setPositioningNode, mousePosition } =
    graphContext;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodeLabel: "",
    },
  });

  useEffect(() => {
    if (mousePosition) {
      handleMouseClick();
    }
  }, [mousePosition]);

  const handleToggleChange = (checked: boolean) => {
    setPositioningNode(checked);
  };

  const handleMouseClick = () => {
    const values = form.getValues();
    const newNodeId = generateNodeId.next().value;

    if (typeof newNodeId !== "number") {
      throw new Error("Failed to generate a valid Node ID");
    }

    if (!values.nodeLabel) {
      toast({
        title: "No label provided",
        description: "Please provide a label to add a node.",
        variant: "destructive",
      });
      return;
    }

    if (!mousePosition) {
      toast({
        title: "No position provided",
        description: "Click on the canvas to select a position for the node.",
        variant: "destructive",
      });
      return;
    }

    const newNode = {
      id: newNodeId,
      label: values.nodeLabel,
      x: mousePosition.x,
      y: mousePosition.y,
    };

    addNode(newNode);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="space-y-8 w-2/3 text-white">
        <div className="flex justify-start items-center gap-2 w-full">
          <FormField
            control={form.control}
            name="nodeLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Node Label</FormLabel>
                <FormControl>
                  <Input placeholder="Label" {...field} />
                </FormControl>
                <FormDescription>Add node with a label.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Toggle
            pressed={positioningNode}
            onPressedChange={handleToggleChange}
          >
            <MousePointerClick style={{ width: "20px", height: "20px" }} />
          </Toggle>
        </div>
      </form>
    </Form>
  );
}
