import { useContext } from "react";
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
import { Input } from "@/components/ui/input";

import { GraphContext } from "@/context/graph-context";
import { generateEdgeId } from "@/utils/generator";
import { Algorithm } from "@/utils/constants";

const FormSchema = z.object({
  from: z.string({
    required_error: "Please select a node for the 'from' edge.",
  }),
  to: z.string({
    required_error: "Please select a node for the 'to' edge.",
  }),
  edgeWeight: z.string({
    required_error: "Please provide a weight for the edge.",
  }),
});

interface EdgeInputFormProps {
  algorithm: Algorithm;
}

export function EdgeInputForm({ algorithm }: EdgeInputFormProps) {
  const graphContext = useContext(GraphContext);

  if (!graphContext) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }

  const { nodes, addEdge } = graphContext;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      from: "",
      to: "",
      edgeWeight: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const edgeWeight = parseInt(data.edgeWeight, 10);

    if (algorithm === Algorithm.Dijkstra && edgeWeight < 0) {
      form.setError("edgeWeight", {
        type: "manual",
        message: "Dijkstra's algorithm does not support negative edge weights.",
      });
      return;
    }

    const newEdgeId = generateEdgeId.next().value;

    if (typeof newEdgeId !== "number") {
      throw new Error("Failed to generate a valid Edge ID");
    }

    const newEdge = {
      id: newEdgeId,
      from: parseInt(data.from, 10),
      to: parseInt(data.to, 10),
      weight: edgeWeight,
    };

    addEdge(newEdge);
    form.reset();
  };

  return (
    <Form {...form}>
      <FormLabel>Add edge</FormLabel>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="From" />
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

          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="To" />
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
        </div>

        <FormField
          control={form.control}
          name="edgeWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edge weight</FormLabel>
              <FormControl>
                <Input placeholder="Weight" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="secondary" type="submit">
          Add
        </Button>
      </form>
    </Form>
  );
}
