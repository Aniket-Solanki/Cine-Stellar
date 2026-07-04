// Netflix-style shimmer loaders for cards, grids, and text fields.
import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx("shimmer-effect rounded-lg bg-zinc-800", className)
      )}
      {...props}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="relative flex-shrink-0 w-[200px] h-[300px] md:w-[240px] md:h-[360px] rounded-xl overflow-hidden border border-zinc-900">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export function MovieRowSkeleton({ title }: { title?: string }) {
  return (
    <div className="flex flex-col space-y-4 py-4">
      {title && <Skeleton className="h-6 w-48 rounded" />}
      <div className="flex space-x-4 overflow-x-hidden no-scrollbar py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[55vh] md:h-[85vh] flex flex-col justify-end p-6 md:p-16 space-y-4 bg-zinc-950">
      <Skeleton className="w-1/4 h-8 md:h-12 rounded" />
      <Skeleton className="w-1/2 h-6 md:h-8 rounded" />
      <Skeleton className="w-1/3 h-16 rounded" />
      <div className="flex space-x-4">
        <Skeleton className="w-28 h-10 rounded-full" />
        <Skeleton className="w-28 h-10 rounded-full" />
      </div>
    </div>
  );
}
