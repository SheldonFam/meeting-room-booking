import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Room, RoomStatus, Booking } from "@/types/models";

interface CapacityRange {
  label: string;
  min: number;
  max: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date as 'Month Day'
export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

// Format a time range as 'HH:MM AM/PM - HH:MM AM/PM'
export function formatTimeRange(start: Date, end: Date): string {
  return `${start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

// Map booking API data to BookingCard props
export function mapBookingToCard(booking: Booking) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  return {
    ...booking,
    date: formatDate(start),
    time: formatTimeRange(start, end),
    meetingTitle: booking.meetingTitle,
    attendees: booking.attendees?.toString() || "",
    bookedBy: booking.bookedBy || (booking.user?.name ?? ""),
    location: booking.location || (booking.room?.name ?? ""),
    status:
      (booking.status as "pending" | "confirmed" | "cancelled") || "confirmed",
  };
}

// Stat formatting (e.g., utilization percentage)
export function formatUtilization(val: number): string {
  return `${val}%`;
}

// Booking filtering helpers
export function isUpcoming(booking: Booking, now: Date) {
  return new Date(booking.startTime) >= now;
}

export function isToday(booking: Booking, today: Date) {
  const start = new Date(booking.startTime);
  return (
    start.getFullYear() === today.getFullYear() &&
    start.getMonth() === today.getMonth() &&
    start.getDate() === today.getDate()
  );
}

// Room filtering helper
export function filterRooms(
  rooms: Room[],
  searchQuery: string,
  selectedStatus: RoomStatus | null,
  selectedCapacity: string | null,
  selectedLocation: string | null,
  capacityRanges: CapacityRange[]
): Room[] {
  return rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !selectedStatus || room.status === selectedStatus;

    const matchesCapacity =
      !selectedCapacity ||
      (() => {
        const selectedRange = capacityRanges.find(
          (range) => range.label === selectedCapacity
        );
        return selectedRange
          ? selectedRange.min <= room.capacity &&
              selectedRange.max >= room.capacity
          : false;
      })();

    const matchesLocation =
      !selectedLocation || room.location === selectedLocation;

    return matchesSearch && matchesStatus && matchesCapacity && matchesLocation;
  });
}
