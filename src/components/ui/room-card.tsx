"use client";

import React, { memo, useCallback } from "react";
import type { RoomCardProps } from "@/types/models";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export const RoomCard = memo<RoomCardProps>(
  ({
    id,
    name,
    capacity,
    facilities,
    location,
    roomDescription,
    imageUrl,
    status,
    onBook,
    className,
    children,
  }) => {
    const router = useRouter();

    const handleBookClick = useCallback(() => {
      if (onBook) {
        onBook();
      } else if (id) {
        router.push(`/rooms/${id}`);
      }
    }, [onBook, id, router]);

    const statusColors = {
      available: "bg-green-100 text-green-800",
      occupied: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800",
    };

    return (
      <div
        className={cn(
          "rounded-lg  border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 flex flex-col h-[450px]",
          className
        )}
      >
        <div className="relative w-full h-40 overflow-hidden rounded-t-md">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`${name} image`}
              fill
              className="object-cover"
            />
          )}
          <Badge
            variant={status === "available" ? "default" : "destructive"}
            className={cn(
              "absolute top-2 right-2 capitalize",
              statusColors[status]
            )}
          >
            {status}
          </Badge>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {capacity} people
            </p>
            {location && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {location}
              </p>
            )}
            {roomDescription && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {roomDescription}
              </p>
            )}
          </div>

          {facilities && facilities.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {facilities.map((facility, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {facility}
                </Badge>
              ))}
            </div>
          )}

          {children}

          {status === "available" && (
            <Button
              onClick={handleBookClick}
              variant="default"
              className="mt-auto"
            >
              View & Book
            </Button>
          )}
        </div>
      </div>
    );
  }
);

RoomCard.displayName = "RoomCard";

export function RoomCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col h-[450px]",
        className
      )}
    >
      {/* Image skeleton */}
      <div className="relative w-full h-40 overflow-hidden rounded-t-md">
        <Skeleton className="h-full w-full" />
        {/* Status badge skeleton */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="space-y-1">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4" />
          {/* Capacity skeleton */}
          <Skeleton className="h-4 w-20" />
          {/* Location skeleton */}
          <Skeleton className="h-4 w-32" />
          {/* Description skeleton */}
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Facilities skeleton */}
        <div className="mt-2 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full mt-auto" />
      </div>
    </div>
  );
}
