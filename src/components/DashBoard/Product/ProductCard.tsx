import React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Update from "./Update";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: "chicken" | "eggs";
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onRefetch: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onRefetch,
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 chicken-shadow border-farm-brown/10">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="w-full h-48 bg-gradient-to-br from-farm-cream to-farm-yellow-soft flex items-center justify-center">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
              {product.image}
            </span>
          </div>

          {/* Stock Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.inStock
                  ? "bg-farm-green text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-farm-brown capitalize">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-farm-brown mb-2">
            {product.name}
          </h3>
          <p className="text-farm-brown/70 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-farm-orange">
                ${product.price}
              </span>
              <span className="text-farm-brown/60 text-sm ml-1">
                /{product.unit}
              </span>
            </div>
          </div>

          {/* Add to Cart / Quantity Controls */}
        </div>
      </CardContent>
      <div className="p-2">
        <Update product={product} onRefetch={onRefetch} />
      </div>
    </Card>
  );
};
