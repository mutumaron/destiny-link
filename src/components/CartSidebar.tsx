import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./ProductCard";
import { CheckoutDialog } from "./CheckoutDialog";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  let itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-farm-brown/10">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-farm-brown" />
              <h2 className="font-display font-semibold text-lg text-farm-brown">
                Your Cart ({itemCount})
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-farm-brown/60 mb-4">Your cart is empty</p>
                <Button
                  onClick={onClose}
                  className="bg-farm-orange hover:bg-farm-orange/90 text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-farm-cream/50 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{item.product.image}</span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-farm-brown mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-farm-brown/60 mb-2">
                          ${item.product.price}/{item.product.unit}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium text-farm-brown min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-farm-brown">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-farm-red hover:text-farm-red hover:bg-farm-red/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-farm-brown/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-semibold text-lg text-farm-brown">
                  Total: ${total.toFixed(2)}
                </span>
              </div>
              <CheckoutDialog
                onClose={onClose}
                onClearCart={onClearCart}
                total={total}
                cartItems={cartItems}
              />
              <p className="text-xs text-farm-brown/60 text-center mt-2">
                Free delivery on orders over $25
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
