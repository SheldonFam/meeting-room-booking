import type { Booking, BookingEvent } from "@/types/models";

export function useBookingsApi() {
  // Fetch bookings for a specific user
  const fetchBookingsForUser = async (
    userId: string | number
  ): Promise<Booking[]> => {
    const res = await fetch(`/api/bookings?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  };

  // Create a new booking
  const createBooking = async (
    data: Omit<BookingEvent, "id"> & {
      location?: string;
      bookedBy?: string;
      status?: string;
    }
  ): Promise<Booking> => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create booking");
    return res.json();
  };

  // Update an existing booking
  const updateBooking = async (
    bookingId: string | number,
    data: Omit<BookingEvent, "id"> & {
      location?: string;
      bookedBy?: string;
      status?: string;
    }
  ): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update booking");
    return res.json();
  };

  return { fetchBookingsForUser, createBooking, updateBooking };
}
