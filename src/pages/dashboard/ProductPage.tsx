import { useDashboard } from "@/context/DashboardContext";
import { ProductSection } from "@/components/DashBoard/Product/ProductSection";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { useEffect, useState } from "react";
import { ProductProps } from "../Index";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Filter from "@/components/DashBoard/Product/Filter";
import Add from "@/components/DashBoard/Product/Add";

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const query = supabase.from("products").select("*").order("category");
    if (searchText) {
      query.ilike("name", `%${searchText}%`);
    }
    const { data, error } = await query;

    if (error) {
      toast("Failed to load products", { description: error.message });
      return;
    }

    setProducts(
      (data ?? []).map((p) => ({
        ...p,
        inStock: p.in_stock,
      }))
    );
    setError(null);

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchText]);

  const chickenProducts = products.filter((p) => p.category === "chicken");
  const eggProducts = products.filter((p) => p.category === "eggs");

  return (
    <div>
      <div className="flex gap-5 items-center w-full">
        <Filter searchText={searchText} setSearchText={setSearchText} />
        <Add onRefetch={fetchProducts} />
      </div>
      <div>
        {loading || error ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-4 py-12 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductSection
            title="Make Changes to Chicken products"
            products={chickenProducts}
            onRefetch={fetchProducts}
          />
        )}
      </div>
      <div>
        {loading || error ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-4 py-12 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductSection
            title="Make Changes to Egg products"
            products={eggProducts}
            onRefetch={fetchProducts}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
