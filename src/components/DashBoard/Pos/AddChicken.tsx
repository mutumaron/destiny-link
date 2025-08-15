import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ellipsis } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ChickenData {
  id: string;
  title: string;
  chicken: number;
  created_at: string; // Make sure your table has timestamps
}

interface UpdateProps {
  stat: ChickenData;
  onRefetch: () => void;
}

const updateSchema = z.object({
  chicken: z.number(),
});

type UpdateForm = z.infer<typeof updateSchema>;

const AddChicken = ({ stat, onRefetch }: UpdateProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      chicken: 0,
    },
  });

  useEffect(() => {
    if (open && stat) {
      form.reset({
        chicken: stat.chicken,
      });
    }
  }, [open, stat, form]);

  async function onSubmit(values: UpdateForm) {
    setLoading(true);
    const { error } = await supabase
      .from("chicken_stats")
      .update({ chicken: values.chicken })
      .eq("id", stat.id);

    if (error) {
      toast.error("Failed to Update", { description: error.message });
      setLoading(false);
    } else {
      toast.success("Succesfully updated Statistic");
      onRefetch();
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Ellipsis className="cursor-pointer" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {stat.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <div className="flex justify-between items-center gap-4">
              <FormField
                control={form.control}
                name="chicken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Update Number of Chicken</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="500"
                        type="number"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" pt-4">
              <Button
                type="submit"
                className="bg-farm-orange hover:bg-farm-orange/90 text-white w-full"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChicken;
