import FilterHistory from "@/components/DashBoard/History/FilterHistory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

const HistoryPage = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
    null
  );
  const [filter, setFilter] = useState<"delivered" | "processing">("delivered");

  const fetchOrders = async () => {
    setLoading(true);
    const query = supabase
      .from("orders")
      .select(`*,order_items(*)`)
      .eq("status", filter)
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
  }, [filter, searchText]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Orders History</h1>
      <div className="flex gap-5 items-center w-full my-4">
        <FilterHistory searchText={searchText} setSearchText={setSearchText} />
      </div>
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === "delivered" ? "default" : "outline"}
          onClick={() => setFilter("delivered")}
          size="sm"
          className="h-7 "
        >
          Completed
        </Button>
        <Button
          variant={filter === "processing" ? "default" : "outline"}
          onClick={() => setFilter("processing")}
          size="sm"
          className="h-7"
        >
          Cancelled
        </Button>
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
                <Card className="bg-gray-200 p-2 h-fit text-sm">
                  {selectedOrder.status == "delivered"
                    ? "Completed"
                    : "Cancelled"}
                </Card>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryPage;
