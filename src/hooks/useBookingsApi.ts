import type { Booking, BookingEvent } from "@/types/models";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export async function fetchBookingsForUser(
  userId: string | number
): Promise<Booking[]> {
  const res = await fetch(`/api/bookings?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function createBooking(
  data: Omit<BookingEvent, "id"> & {
    location?: string;
    bookedBy?: string;
    status?: string;
  }
): Promise<Booking> {
  const apiData = {
    roomId: Number(data.roomId),
    startTime: data.startTime,
    endTime: data.endTime,
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
}

export async function updateBooking(
  bookingId: string | number,
  data: Omit<BookingEvent, "id"> & {
    location?: string;
    bookedBy?: string;
    status?: string;
  }
): Promise<Booking> {
  const apiData = {
    roomId: Number(data.roomId),
    startTime: data.startTime,
    endTime: data.endTime,
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
}

const BOOKINGS_KEY = "bookings";

// Fetch bookings
export function useBookings(userId: string | number) {
  return useQuery<Booking[]>({
    queryKey: [BOOKINGS_KEY, userId],
    queryFn: () => fetchBookingsForUser(userId),
    enabled: !!userId,
  });
}

// Create booking
export function useCreateBooking(userId: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_KEY, userId] });
    },
  });
}

// Update booking
export function useUpdateBooking(userId: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string | number;
      data: Omit<BookingEvent, "id">;
    }) => updateBooking(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_KEY, userId] });
    },
  });
}
