import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

const formSchema = z.object({
  nodeLabel: z.string().min(1, {
    message: "Node label must be at least 1 characters.",
  }),
});

interface NodeInputFormProps {
  isNodePlacementReady: boolean;
  onSubmit: (nodeLabel: string) => void;
}

export function NodeInputForm({
  isNodePlacementReady,
  onSubmit,
}: NodeInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodeLabel: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.nodeLabel);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-2/3 text-white"
      >
        <FormField
          control={form.control}
          name="nodeLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node Label</FormLabel>
              <FormControl>
                <Input placeholder="Label" {...field} />
              </FormControl>
              <FormDescription>
                Click on the left void to position the node
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!isNodePlacementReady}>
          Add node
        </Button>
      </form>
    </Form>
  );
}
