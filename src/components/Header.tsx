import React, { useState } from "react";
import { ShoppingCart, Menu, X, Truck, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemsCount,
  onCartClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-farm-brown/10 chicken-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-farm-yellow rounded-full flex items-center justify-center">
              <span className="text-2xl">🐔</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-farm-brown">
                DestinyLink
              </h1>
              <p className="text-xs text-farm-brown/70 leading-none">
                Farm to Table
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#chicken"
              className="text-farm-brown hover:text-farm-orange transition-colors font-medium"
            >
              Chicken
            </a>
            <a
              href="#eggs"
              className="text-farm-brown hover:text-farm-orange transition-colors font-medium"
            >
              Eggs
            </a>
            <div className="flex items-center space-x-4 text-sm text-farm-brown/70">
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Same Day</span>
              </div>
            </div>
          </nav>

          {/* Cart Button */}
          <div className="flex gap-4 items-center">
            <NavLink
              to={"/dashboard"}
              className={
                "flex gap-2 text-farm-brown transition-colors font-medium hover:text-farm-orange"
              }
            >
              Dashboard
            </NavLink>
            <div className="flex items-center space-x-4">
              <Button
                onClick={onCartClick}
                variant="outline"
                size="sm"
                className="relative border-farm-brown/20 hover:bg-farm-yellow/20"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-farm-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-farm-brown/10">
            <nav className="flex flex-col space-y-3">
              <a
                href="#chicken"
                className="text-farm-brown hover:text-farm-orange transition-colors font-medium"
              >
                Chicken
              </a>
              <a
                href="#eggs"
                className="text-farm-brown hover:text-farm-orange transition-colors font-medium"
              >
                Eggs
              </a>
              <div className="flex items-center justify-between pt-2 text-sm text-farm-brown/70">
                <div className="flex items-center space-x-1">
                  <Truck className="w-4 h-4" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Same Day</span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
