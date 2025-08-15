"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductProps } from "@/pages/Index";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface CartItem {
  product: ProductProps;
  quantity: number;
}

interface CheckoutDialogProps {
  onClose: () => void;
  onClearCart: () => void;
  total: number;
  cartItems: CartItem[];
}

async function placeOrder({
  firstName,
  lastName,
  phone,
  location,
  total,
  cartItems,
}: {
  firstName: string;
  lastName: string;
  phone: string;
  location?: string;
  total: number;
  cartItems: {
    product: ProductProps;
    quantity: number;
  }[];
}) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      location,
      total_price: total,
    })
    .select()
    .single();

  if (orderError || !order) {
    toast.error("Order Failed", { description: orderError?.message });
    return null;
  }
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    quantity: item.quantity,
    unit_price: item.product.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    toast.error("Failed to save items", { description: itemsError?.message });
    return null;
  }

  return order;
}

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  location: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const CART_COOKIE_KEY = "cart-items";

export function CheckoutDialog({
  onClose,
  onClearCart,
  total,
  cartItems,
}: CheckoutDialogProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      location: "",
    },
  });

  async function onSubmit(values: CheckoutForm) {
    setLoading(true);
    const order = await placeOrder({
      ...(values as {
        firstName: string;
        lastName: string;
        phone: string;
        location?: string;
      }),
      total,
      cartItems,
    });

    if (order) {
      toast.success("Order placed 🎉", {
        description: "Thank you! We'll deliver your items soon.",
      });

      onClearCart();
      Cookies.remove(CART_COOKIE_KEY);
      onClose();
      setOpen(false);
    }
    // submit to backend, show toast, etc

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-farm-green text-white py-3">
          Proceed to Checkout
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Complete Your Order Totaling To
            <span> </span>
            <span className="font-display font-semibold text-lg text-farm-brown">
              KSH: {total.toFixed(2)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="0712 345 678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (within Maua)</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=" pt-4">
              <Button
                type="submit"
                className="bg-farm-orange hover:bg-farm-orange/90 text-white w-full"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
