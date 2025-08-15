
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: 'chicken' | 'eggs';
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

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
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.inStock 
                ? 'bg-farm-green text-white' 
                : 'bg-gray-400 text-white'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
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
          {quantity === 0 ? (
            <Button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className="w-full bg-farm-orange hover:bg-farm-orange/90 text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 bg-farm-cream rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-8 h-8 p-0 hover:bg-farm-brown hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold text-farm-brown min-w-[2rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-8 h-8 p-0 hover:bg-farm-brown hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="font-semibold text-farm-brown">
                ${(product.price * quantity).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
