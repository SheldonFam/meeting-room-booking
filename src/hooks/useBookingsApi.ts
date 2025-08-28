import type { Booking, BookingEvent } from "@/types/models";
import { useCallback } from "react";

export function useBookingsApi() {
  // Fetch bookings for a specific user
  const fetchBookingsForUser = useCallback(
    async (userId: string | number): Promise<Booking[]> => {
      const res = await fetch(`/api/bookings?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    []
  );

  // Create a new booking
  const createBooking = useCallback(
    async (
      data: Omit<BookingEvent, "id"> & {
        location?: string;
        bookedBy?: string;
        status?: string;
      }
    ): Promise<Booking> => {
      const apiData = {
        roomId: Number(data.roomId),
        startTime: `${data.startDate}T${data.startTime}:00`,
        endTime: `${data.endDate}T${data.endTime}:00`,
        meetingTitle: data.title,
        attendees: data.attendees,
        location: data.location || "",
        bookedBy: data.bookedBy || "",
        status: data.status,
        description: data.description,
        color: data.color,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });
      if (!res.ok) throw new Error("Failed to create booking");
      return res.json();
    },
    []
  );

  // Update an existing booking
  const updateBooking = useCallback(
    async (
      bookingId: string | number,
      data: Omit<BookingEvent, "id"> & {
        location?: string;
        bookedBy?: string;
        status?: string;
      }
    ): Promise<Booking> => {
      const apiData = {
        roomId: Number(data.roomId),
        startTime: `${data.startDate}T${data.startTime}:00`,
        endTime: `${data.endDate}T${data.endTime}:00`,
        meetingTitle: data.title,
        attendees: data.attendees,
        location: data.location || "",
        bookedBy: data.bookedBy || "",
        status: data.status,
        description: data.description,
        color: data.color,
      };

      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) throw new Error("Failed to update booking");
      return res.json();
    },
    []
  );

  return { fetchBookingsForUser, createBooking, updateBooking };
}
