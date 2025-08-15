import { ShoppingBag, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";

interface CartSidebarSkeletonProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebarSkeleton({
  isOpen,
  onClose,
}: CartSidebarSkeletonProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-farm-brown/10">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-farm-brown" />
              <h2 className="font-display font-semibold text-lg text-farm-brown">
                Loading Cart...
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Skeleton Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-farm-cream/50 rounded-lg p-4 space-y-3 animate-pulse"
              >
                <div className="flex items-start space-x-3">
                  {/* Image */}
                  <Skeleton className="w-16 h-16 rounded-lg" />

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-6 w-10" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-farm-brown/10 p-4 space-y-2">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
