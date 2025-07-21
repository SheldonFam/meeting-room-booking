"use-client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookingCardProps } from "@/types/models";

export function BookingCard({
  meetingTitle,
  attendees,
  bookedBy,
  location,
  time,
  date,
  status,
  description,
  className,
}: BookingCardProps) {
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={cn(
        "relative border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm",
        className
      )}
    >
      <Badge
        variant={
          status === "confirmed"
            ? "default"
            : status === "pending"
            ? "secondary"
            : "destructive"
        }
        className={cn(
          "absolute top-2 right-2 mt-2 capitalize",
          statusColors[status]
        )}
      >
        {status}
      </Badge>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{meetingTitle}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm text-gray-600">{date}</p>
          <p className="text-sm text-gray-600">{time}</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm text-gray-600">{location}</p>
          <p className="text-sm text-gray-600">{attendees} attendees</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Booked by {bookedBy}
        </p>
      </div>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="rounded-lg p-4 mb-2">
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-3 w-1/3 mb-1" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  );
}
