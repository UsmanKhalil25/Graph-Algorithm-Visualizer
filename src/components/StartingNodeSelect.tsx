import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraphContext } from "@/context/graph-context";
import { useContext } from "react";

const FormSchema = z.object({
  startingNode: z.string({
    required_error: "Please select a node for the 'from' edge.",
  }),
});

export function StartingNodeInput() {
  const graphContext = useContext(GraphContext);

  if (!graphContext) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }

  const { nodes, setStartingNode } = graphContext;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startingNode: "",
    },
  });

  const handleSelectChange = (value: string) => {
    const selectedNode =
      nodes.find((node) => node.id === parseInt(value, 10)) || null;
    setStartingNode(selectedNode);
  };

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="startingNode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Node</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSelectChange(value);
                }}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a node" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {nodes.map((node) => (
                    <SelectItem key={node.id} value={String(node.id)}>
                      {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
