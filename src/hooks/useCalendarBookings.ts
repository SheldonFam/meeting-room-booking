import { useEffect, useState } from "react";
import { useBookingsApi } from "./useBookingsApi";
import { CalendarEvent } from "@/lib/utils";
import { Booking, BookingEvent } from "@/types/models";
import { bookingToEvent, mapBookingsToCalendarEvents } from "@/utils/calendar";

export function useCalendarBookings(userId?: string | number) {
  const { fetchBookingsForUser, createBooking, updateBooking } =
    useBookingsApi();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setEvents([]);
      return;
    }
    setLoading(true);
    fetchBookingsForUser(userId)
      .then((bookings: Booking[]) =>
        setEvents(mapBookingsToCalendarEvents(bookings))
      )
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [userId]);

  async function addBooking(data: Omit<BookingEvent, "id">) {
    const booking = await createBooking(data);
    setEvents((prev) => [...prev, bookingToEvent(booking)]);
    return booking;
  }

  async function editBooking(
    id: string | number,
    data: Omit<BookingEvent, "id">
  ) {
    const booking = await updateBooking(id, data);
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? bookingToEvent(booking) : evt))
    );
    return booking;
  }

  return {
    events,
    loading,
    addBooking,
    editBooking,
    setEvents,
  };
}
