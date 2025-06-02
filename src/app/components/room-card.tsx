"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface RoomCardProps {
  name: string;
  capacity: number;
  facilities: string[];
  status: "available" | "occupied" | "maintenance";
  onBook?: () => void;
  className?: string;
  children?: ReactNode;
}

export function RoomCard({
  name,
  capacity,
  facilities,
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
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Capacity: {capacity} people
          </p>
        </div>
        <Badge
          variant={status === "available" ? "default" : "destructive"}
          className={cn("capitalize", statusColors[status])}
        >
          {status}
        </Badge>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Facilities
        </h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {facilities.map((facility) => (
            <Badge key={facility} variant="secondary" className="text-xs">
              {facility}
            </Badge>
          ))}
        </div>
      </div>

      {children}

      {onBook && status === "available" && (
        <button
          onClick={onBook}
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Book Now
        </button>
      )}
    </div>
  );
}
