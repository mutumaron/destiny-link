import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import Cookies from "js-cookie";
import { HeroSection } from "@/components/HeroSection";
import { ProductSection } from "@/components/ProductSection";
import { CartSidebar } from "@/components/CartSidebar";

import { Product } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { CartSidebarSkeleton } from "@/components/CartSideBarSkeleton";

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: "chicken" | "eggs";
  inStock: boolean;
}

const CART_COOKIE_KEY = "cart-items";

const Index = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Record<string, number>>(() => {
    try {
      const cookieData = Cookies.get(CART_COOKIE_KEY);
      return cookieData ? JSON.parse(cookieData) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("category");
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
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const chickenProducts = products.filter((p) => p.category === "chicken");
  const eggProducts = products.filter((p) => p.category === "eggs");
  console.log(loading);

  useEffect(() => {
    Cookies.set(CART_COOKIE_KEY, JSON.stringify(cartItems), {
      expires: 7,
      sameSite: "Lax",
    });
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));

    toast("Added to cart", {
      description: `${product.name} Has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      });
    } else {
      setCartItems((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });

    toast("Remove from cart", {
      description: "An item has been removed from your cart",
    });
  };

  const cartItemsArray = useMemo(() => {
    if (products.length === 0) return [];

    return Object.entries(cartItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return product ? { product, quantity } : null;
      })
      .filter(
        (item): item is { product: ProductProps; quantity: number } => !!item
      );
  }, [cartItems, products]);

  const totalCartItems = Object.values(cartItems).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemsCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
      />

      <HeroSection />

      <div id="products">
        <div id="chicken">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-4 py-12 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductSection
              title="Fresh Chicken"
              description="Premium quality chicken from local farms. Choose from broiler, kienyeji, and various cuts to suit your cooking needs."
              products={chickenProducts}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}
        </div>

        <div id="eggs" className="bg-farm-cream/30">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-4 py-12 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductSection
              title="Farm Fresh Eggs"
              description="Fresh eggs from happy, healthy hens. Available in various sizes and types for all your cooking and baking needs."
              products={eggProducts}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}
        </div>
      </div>
      <Footer />

      {loading ? (
        <CartSidebarSkeleton
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      ) : (
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItemsArray}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={() => setCartItems({})}
        />
      )}
    </div>
  );
};

export default Index;
