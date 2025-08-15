import FilterOrder from "@/components/DashBoard/Orders/FilterOrder";
import NewOrder from "@/components/DashBoard/Orders/NewOrder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export type Order = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string | null;
  total_price: number;
  status: "pending" | "processing" | "delivered";
  created_at: string; // ISO timestamp
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number; // generated: quantity * unit_price
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

const BookingsPage = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const query = supabase
      .from("orders")
      .select(`*,order_items(*)`)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (searchText) {
      query.ilike("first_name", `%${searchText}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to fetch orders", { description: error.message });
    } else {
      setOrders(data as OrderWithItems[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [searchText]);
  const handleUpdateStatus = async (newStatus: "delivered" | "processing") => {
    setLoading(true);
    if (!selectedOrder) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", selectedOrder.id);

    if (error) {
      toast.error("Failed to update order status", {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`Order marked as ${newStatus}`);

    // Update UI
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      )
    );

    setSelectedOrder(null); // Close modal
    setLoading(false);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    const { error } = await supabase
      .from("order_items")
      .delete()
      .eq("id", itemToDelete.id);

    if (error) {
      toast.error("Failed to delete item", { description: error.message });
      return;
    }

    toast.success("Item deleted");

    // Option 1: Update local state without refetch
    setOrders((prev) =>
      prev.map((order) =>
        order.id === itemToDelete.order_id
          ? {
              ...order,
              order_items: order.order_items.filter(
                (item) => item.id !== itemToDelete.id
              ),
            }
          : order
      )
    );

    setItemToDelete(null);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Customer Orders</h1>
      <div className="flex flex-col gap-5 w-full my-4 md:flex-row">
        <FilterOrder searchText={searchText} setSearchText={setSearchText} />
        <NewOrder title="New Order" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            : orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell>
                    {order.first_name} {order.last_name}
                  </TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{order.location || "-"}</TableCell>
                  <TableCell className="capitalize">{order.status}</TableCell>
                  <TableCell>KES {order.total_price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedOrder.first_name} {selectedOrder.last_name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.phone}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {selectedOrder.location || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {selectedOrder.status}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    className="bg-farm-green hover:bg-farm-green/60"
                    disabled={loading}
                    onClick={() => handleUpdateStatus("delivered")}
                  >
                    {loading ? "Completing..." : "Complete"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-farm-red hover:bg-farm-red/70"
                    onClick={() => handleUpdateStatus("processing")}
                  >
                    {loading ? "Cancelling..." : "Cancel"}
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.order_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>KES {item.unit_price.toFixed(2)}</TableCell>
                      <TableCell>KES {item.total_price.toFixed(2)}</TableCell>
                      <TableCell className=" p-3 flex items-center justify-center">
                        <Trash
                          className="text-red-500 bg-red-200 rounded-full p-2 cursor-pointer"
                          size={30}
                          onClick={() => setItemToDelete(item)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-medium">{itemToDelete?.product_name}</span>{" "}
            from the order?
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-4 py-2 text-sm rounded-md border"
              onClick={() => setItemToDelete(null)}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteItem}
              className="px-4 py-2 text-sm rounded-md bg-red-500 text-white"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsPage;
