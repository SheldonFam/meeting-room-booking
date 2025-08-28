import { CalendarEvent } from "@/lib/utils";
import { Booking } from "@/types/models";

export function mapBookingsToCalendarEvents(
  bookings: Booking[]
): CalendarEvent[] {
  return bookings.map(bookingToEvent);
}

export function bookingToEvent(booking: Booking): CalendarEvent {
  return {
    id: booking.id.toString(),
    title: booking.meetingTitle,
    start: booking.startTime,
    end: booking.endTime,
    location: booking.location || "",
    extendedProps: {
      calendar: "Primary",
      description: booking.description || "",
      attendees: booking.attendees,
      startTime: booking.startTime.split("T")[1],
      endTime: booking.endTime.split("T")[1],
      roomId: booking.room.id.toString(),
    },
  };
}
