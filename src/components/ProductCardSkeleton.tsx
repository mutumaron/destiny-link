import { Skeleton } from "./ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <div className="rounded-lg border shadow-sm p-4 space-y-4">
      <div className="w-full h-40 bg-muted flex items-center justify-center rounded-md">
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
};
