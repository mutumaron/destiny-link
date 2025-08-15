
import React from 'react';
import { ProductCard, Product } from './ProductCard';

interface ProductSectionProps {
  title: string;
  description: string;
  products: Product[];
  cartItems: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  description,
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
}) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-farm-brown mb-4">
            {title}
          </h2>
          <p className="text-lg text-farm-brown/70 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartItems[product.id] || 0}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
