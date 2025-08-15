import React from "react";
import { Truck, Clock, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useTheme } from "next-themes";

export const HeroSection: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <section className="relative overflow-hidden farm-gradient py-12 md:py-20 ">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl animate-bounce-gentle">
          🐔
        </div>
        <div
          className="absolute top-32 right-20 text-4xl animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        >
          🥚
        </div>
        <div
          className="absolute bottom-20 left-1/4 text-5xl animate-bounce-gentle"
          style={{ animationDelay: "2s" }}
        >
          🐓
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-farm-brown mb-6 leading-tight">
              Farm Fresh
              <span className="text-farm-orange block">Chicken & Eggs</span>
              <span className="text-2xl md:text-3xl font-normal block mt-2">
                Delivered Daily
              </span>
            </h1>

            <p className="text-lg text-farm-brown/80 mb-8 max-w-lg mx-auto lg:mx-0">
              Experience the difference of truly fresh, locally-sourced poultry
              and eggs. From our farm to your table with same-day delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                className="bg-farm-orange hover:bg-farm-orange/90 text-white font-semibold px-8"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Shop Now
              </Button>
              <Dialog>
                <DialogTrigger className="text-farm-brown hover:text-farm-orange transition-colors font-medium">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-farm-brown text-farm-brown hover:bg-farm-brown hover:text-white"
                  >
                    Learn More
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-farm-brown font-bold text-2xl">
                      About Destiny Link
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h1 className="text-lg font-semibold text-farm-brown">
                        Who We Are
                      </h1>
                      <p>
                        Destiny Link is a locally owned ecommerce platform based
                        in <strong>Maua, Meru, Kenya</strong>. We specialize in
                        the supply of high-quality, farm-fresh chicken and eggs
                        for households, businesses, and institutions across the
                        region.
                      </p>
                    </div>

                    <div>
                      <h1 className="text-lg font-semibold text-farm-brown">
                        Our Mission
                      </h1>
                      <p>
                        To connect farmers with customers through a reliable,
                        affordable, and sustainable digital platform, ensuring
                        access to fresh poultry products every day.
                      </p>
                    </div>

                    <div>
                      <h1 className="text-lg font-semibold text-farm-brown">
                        What We Offer
                      </h1>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Farm-fresh eggs delivered to your doorstep</li>
                        <li>Live and slaughtered chicken available on order</li>
                        <li>Bulk supply for hotels, restaurants, and events</li>
                        <li>Affordable pricing with reliable delivery</li>
                      </ul>
                    </div>

                    <div>
                      <h1 className="text-lg font-semibold text-farm-brown">
                        Why Choose Us?
                      </h1>
                      <p>
                        We’re more than just an online shop — we’re a
                        community-driven business built on trust, quality, and
                        convenience. Whether you're a parent looking for healthy
                        meals or a business stocking up, Destiny Link has your
                        back 🐔🥚.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start">
                <Truck className="w-8 h-8 text-farm-green mb-2" />
                <span className="text-sm font-medium text-farm-brown">
                  Free Delivery
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Clock className="w-8 h-8 text-farm-green mb-2" />
                <span className="text-sm font-medium text-farm-brown">
                  Same Day
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Shield className="w-8 h-8 text-farm-green mb-2" />
                <span className="text-sm font-medium text-farm-brown">
                  Quality Assured
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Star className="w-8 h-8 text-farm-green mb-2" />
                <span className="text-sm font-medium text-farm-brown">
                  5-Star Rated
                </span>
              </div>
            </div>
          </div>

          {/* Mascot/Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Chicken Mascot */}
              <div className="w-80 h-80 bg-gradient-to-br from-farm-yellow to-farm-orange rounded-full flex items-center justify-center chicken-shadow">
                <div className="text-9xl animate-bounce-gentle">🐔</div>
              </div>

              {/* Floating Elements */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center chicken-shadow animate-bounce-gentle"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-2xl">🥚</span>
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-farm-green-light rounded-full flex items-center justify-center animate-bounce-gentle"
                style={{ animationDelay: "1.5s" }}
              >
                <span className="text-lg">🌱</span>
              </div>
              <div
                className="absolute top-1/2 -left-8 w-10 h-10 bg-farm-cream rounded-full flex items-center justify-center animate-bounce-gentle"
                style={{ animationDelay: "2.5s" }}
              >
                <span className="text-sm">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
