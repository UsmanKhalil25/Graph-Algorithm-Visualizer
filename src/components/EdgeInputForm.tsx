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

import { Edge } from "@/types/edge";
import { Node } from "@/types/node";

import { generateEdgeId } from "@/utils/generator";

const FormSchema = z.object({
  from: z.string({
    required_error: "Please select a node for the 'from' edge.",
  }),
  to: z.string({
    required_error: "Please select a node for the 'to' edge.",
  }),
  edgeWeight: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Edge weight must be a valid number.",
    })
    .min(1, { message: "Edge weight is required." }),
});

interface EdgeInputFormProps {
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nodes: Node[];
}

export function EdgeInputForm({ edges, setEdges, nodes }: EdgeInputFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      from: "",
      to: "",
      edgeWeight: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newEdge: Edge = {
      id: generateEdgeId.next().value!,
      from: parseInt(data.from),
      to: parseInt(data.to),
      weight: parseFloat(data.edgeWeight),
    };

    setEdges([...edges, newEdge]);
    form.reset(); // Reset the form state
  }

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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
