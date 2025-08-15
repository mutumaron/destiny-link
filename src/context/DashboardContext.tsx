import React, { createContext, useContext, useEffect, useState } from "react";

import { ProductProps } from "@/pages/Index";
import { supabase } from "@/lib/supabaseClient";

interface DashBoardContextType {
  products: ProductProps[] | null;
  loading: boolean;
  error: string | null;
}

const DashboardContext = createContext<DashBoardContextType>({
  products: null,
  loading: true,
  error: null,
});

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<ProductProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("initialize");
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      console.log("DashboardContext products in ProductPage:", data);
      if (error) {
        setError(error.message);
        setProducts(null);
      } else {
        setProducts(data);
        setError(null);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        products,
        loading,
        error,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
