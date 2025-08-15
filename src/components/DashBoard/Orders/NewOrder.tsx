import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface AddProps {
  title: string;
}
interface Product {
  id: string;
  name: string;
  price: number;
}

const NewOrder = ({ title }: AddProps) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
  });

  // Fetch products when dialog opens
  useEffect(() => {
    if (open) {
      (async () => {
        setLoading(true);
        const query = supabase.from("products").select("id, name, price");
        if (searchText) {
          query.ilike("name", `%${searchText}%`);
        }
        const { data, error } = await query;
        if (error) toast.error(error.message);
        else setProducts(data || []);
        setLoading(false);
      })();
    }
  }, [open, searchText]);

  const addProduct = (product: Product) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setOrderItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setOrderItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i
        )
      );
    }
  };

  const total = orderItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!customer.firstName || !customer.lastName || !customer.phone) {
      toast.error("Fill all required fields");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("No items in order");
      return;
    }

    setLoading(true);
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        first_name: customer.firstName,
        last_name: customer.lastName,
        phone: customer.phone,
        location: customer.location,
        total_price: total,
      })
      .select()
      .single();

    if (orderError || !order) {
      toast.error("Order creation failed", {
        description: orderError?.message,
      });
      setLoading(false);
      return;
    }

    const orderItemsData = orderItems.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) {
      toast.error("Failed to save items", { description: itemsError.message });
    } else {
      toast.success("Order created successfully");
      setOpen(false);
      setOrderItems([]);
      setCustomer({ firstName: "", lastName: "", phone: "", location: "" });
      setStep(1);
    }

    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8" size="sm">
          <Plus />

          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Select Products" : "Customer Details"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex gap-5 items-center flex-1">
              <div className="w-full">
                <Input
                  placeholder="Search For A Product"
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <Search />
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <Table className="table-fixed w-full">
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="sticky top-0 bg-white z-10">
                      Name
                    </TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">
                      Price
                    </TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">
                      Status
                    </TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">
                      Quantity
                    </TableHead>
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
                        </TableRow>
                      ))
                    : products.map((product) => {
                        const selected = orderItems.find(
                          (i) => i.product.id === product.id
                        );
                        return (
                          <TableRow key={product.id} className="cursor-pointer">
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>pending</TableCell>
                            <TableCell>
                              {" "}
                              {selected ? (
                                <div className="flex items-center gap-2 mt-2 w-full">
                                  <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                      updateQuantity(
                                        product.id,
                                        selected.quantity - 1
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <span>{selected.quantity}</span>
                                  <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                      updateQuantity(
                                        product.id,
                                        selected.quantity + 1
                                      )
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  className="mt-2 w-full"
                                  onClick={() => addProduct(product)}
                                >
                                  Add
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <span className="font-bold">Total: KSH {total.toFixed(2)}</span>
              <Button
                onClick={() => setStep(2)}
                disabled={orderItems.length === 0}
              >
                Next: Customer Details
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                value={customer.firstName}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, firstName: e.target.value }))
                }
              />
              <Input
                placeholder="Last Name"
                value={customer.lastName}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, lastName: e.target.value }))
                }
              />
              <Input
                placeholder="Phone"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, phone: e.target.value }))
                }
              />
              <Input
                placeholder="Location"
                value={customer.location}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, location: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={placeOrder} disabled={loading}>
                {loading ? "Placing..." : "Place Order"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewOrder;
