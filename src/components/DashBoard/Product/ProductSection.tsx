import React from "react";
import { Product, ProductCard } from "./ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
  onRefetch: () => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,

  products,
  onRefetch,
}) => {
  return (
    <section className="py-5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-farm-brown mb-4">
            {title}
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRefetch={onRefetch}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
