"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import Image from "next/image";
import { Button } from "./button";

interface RoomCardProps {
  name: string;
  capacity: number;
  facilities: string[];
  location?: string;
  roomDescription?: string;
  imageUrl?: string;
  status: "available" | "occupied" | "maintenance";
  onBook?: () => void;
  className?: string;
  children?: ReactNode;
}

export function RoomCard({
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
}: RoomCardProps) {
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

        {onBook && status === "available" && (
          <Button
            onClick={onBook}
            variant="primary"
            fullWidth
            className="mt-auto"
          >
            Book Now
          </Button>
        )}
      </div>
    </div>
  );
}
