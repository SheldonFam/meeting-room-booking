import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Room, RoomStatus, Booking, BookingEvent } from "@/types/models";
import type { EventInput } from "@fullcalendar/core";

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
  return `${start.toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString("en-MY", {
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

// --- Calendar Utilities ---

// Pad a number with leading zero
export function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// Format a Date object as YYYY-MM-DD
export function toLocalDateString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

// Type guard for Date
export function isDate(val: unknown): val is Date {
  return Object.prototype.toString.call(val) === "[object Date]";
}

export interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    description?: string;
    attendees?: number;
    startTime?: string;
    endTime?: string;
    roomId?: string;
  };
}

export function getTimeAMPM(time24: string): string {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert 0 to 12 for AM/PM format
  return `${hour}:${minute} ${ampm}`;
}

export function eventToInitialValues(
  event: CalendarEvent
): Partial<BookingEvent> {
  console.log(event);
  let startTime = "";
  let endTime = "";
  let startDate = "";
  let endDate = "";

  if (event.start instanceof Date) {
    startDate = event.start.toISOString().split("T")[0];
    startTime = getTimeAMPM(event.start.toTimeString().slice(0, 5));
  } else if (typeof event.start === "string" && event.start.includes("T")) {
    startDate = event.start.split("T")[0];

    startTime = getTimeAMPM(event.start.split("T")[1]?.slice(0, 5) || "");
  } else if (event.extendedProps?.startTime) {
    startTime = getTimeAMPM(event.extendedProps.startTime);
  }

  if (event.end instanceof Date) {
    endDate = event.end.toISOString().split("T")[0];
    endTime = getTimeAMPM(event.end.toTimeString().slice(0, 5));
  } else if (typeof event.end === "string" && event.end.includes("T")) {
    endDate = event.end.split("T")[0];
    endTime = getTimeAMPM(event.end.split("T")[1]?.slice(0, 5) || "");
  } else if (event.extendedProps?.endTime) {
    endTime = getTimeAMPM(event.extendedProps.endTime);
  }

  return {
    title: event.title,
    description: event.extendedProps?.description || "",
    startDate,
    endDate,
    color: event.extendedProps?.calendar,
    attendees: event.extendedProps?.attendees || 0,
    startTime,
    endTime,
    roomId: event.extendedProps?.roomId || "",
  };
}

// Map Booking[] to CalendarEvent[] for FullCalendar
export function mapBookingsToCalendarEvents(
  bookings: Booking[]
): CalendarEvent[] {
  return bookings.map((booking) => ({
    id: booking.id.toString(),
    title: booking.meetingTitle || "Booking",
    start: booking.startTime,
    end: booking.endTime,
    extendedProps: {
      calendar: "Primary",
      description: booking.description,
      attendees: booking.attendees,
      startTime: booking.startTime.split("T")[1]?.slice(0, 5) || "",
      endTime: booking.endTime.split("T")[1]?.slice(0, 5) || "",
      roomId: booking.room ? String(booking.room.id) : "",
    },
  }));
}

export function buildBookingPayload(
  data: Omit<BookingEvent, "id">,
  user?: { name?: string } | null,
  selectedRoom?: { location?: string }
): Omit<BookingEvent, "id"> {
  const {
    title,
    description,
    startDate,
    endDate,
    color,
    attendees,
    startTime,
    endTime,
    roomId,
  } = data;

  const start = isDate(startDate) ? toLocalDateString(startDate) : startDate;
  const end = isDate(endDate) ? toLocalDateString(endDate) : endDate;

  return {
    title,
    description,
    startDate: start,
    endDate: end,
    startTime,
    endTime,
    attendees: attendees !== undefined ? Number(attendees) : 0,
    color: color ? String(color) : undefined,
    roomId: String(roomId),
    location: selectedRoom ? selectedRoom.location : "",
    bookedBy: user?.name || "",
    status: "pending",
  };
}

export function combineDateAndTime(date: Date, time12h: string): string {
  const [time, period] = time12h.split(" ");
  const [rawHours, minutes] = time.split(":").map(Number);
  let hours = rawHours;

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);

  return combined.toISOString();
}
