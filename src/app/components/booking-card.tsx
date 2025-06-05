"use-client";

import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  meetingTitle: string;
  attendees: string;
  location: string;
  bookedBy: string;
  time: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  className?: string;
}

export function BookingCard({
  meetingTitle,
  attendees,
  bookedBy,
  location,
  time,
  date,
  status,
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
