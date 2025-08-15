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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Product } from "./ProductCard";

interface ProductCardProps {
  product: Product;
  onRefetch: () => void;
}

const updateSchema = z.object({
  price: z.number(),
  inStock: z.boolean(),
});

type UpdateForm = z.infer<typeof updateSchema>;

const Update = ({ product, onRefetch }: ProductCardProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      price: 0,
      inStock: false,
    },
  });

  useEffect(() => {
    if (open && product) {
      form.reset({
        price: product.price,
        inStock: product.inStock,
      });
    }
  }, [open, product, form]);
  async function onSubmit(values: UpdateForm) {
    setLoading(true);

    const { error } = await supabase
      .from("products")
      .update({
        price: values.price,
        in_stock: values.inStock,
      })
      .eq("id", product.id);

    if (error) {
      toast.error("Failed to Update", { description: error.message });
      setLoading(false);
    } else {
      toast.success("Succesfully updated product");
      onRefetch();
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-white py-3">Update Product</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {product.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <div className="flex justify-between items-center gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change Price</FormLabel>
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
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex gap-3 items-center">
                    <FormLabel>In stock status</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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

export default Update;
