import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddProps {
  onRefetch: () => void;
}

const categories = [
  "Feed",
  "Vet",
  "Medicine",
  "Manure",
  "Sawdust",
  "Chickens Purchased",
  "Other",
];

const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "Amount must be a number"),
  expense_date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), "Invalid date format"),
});

type AddForm = z.infer<typeof expenseSchema>;

const AddExpense = ({ onRefetch }: AddProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<AddForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: "",
      description: "",
      amount: 0,
      expense_date: "",
    },
  });

  async function onSubmit(values: AddForm) {
    setLoading(false);
    //POST Req
    // const dateToUse =
    //   values.expense_date || new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("expenses").insert([
      {
        category: values.category,
        description: values.description,
        amount: values.amount,
        expense_date: values.expense_date,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Failed to save expense");
    } else {
      toast.success("Expense saved successfully");
      form.reset();
    }
    setLoading(false);

    toast.success("Expense added successfully!");
    setOpen(false);
    onRefetch();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8">
          <Plus /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={cat}
                            value={cat}
                          >
                            {cat}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Expense details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expense_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Expense date (optional)"
                        type="date"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
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
                className=" flex gap-2 items-center bg-farm-orange hover:bg-farm-orange/90 text-white w-full"
                disabled={loading}
              >
                <Plus />
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpense;
