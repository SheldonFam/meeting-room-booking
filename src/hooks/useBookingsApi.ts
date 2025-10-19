import type {
  Booking,
  BookingEvent,
  FetchBookingOptions,
} from "@/types/models";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BOOKINGS_KEY = "bookings";

/*  ---- API functions ---- */

export async function fetchBookingsForUser(
  userId: string | number
): Promise<Booking[]> {
  const res = await fetch(`/api/bookings?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function fetchBookings(
  options: FetchBookingOptions = {}
): Promise<Booking[]> {
  let url = "/api/bookings";
  const params = new URLSearchParams();
  if (options.userId) params.append("userId", options.userId.toString());
  if (options.from) params.append("from", options.from);
  if (options.date) params.append("date", options.date);
  if (options.roomId) params.append("roomId", options.roomId.toString());
  if (Array.from(params).length) url += `?${params.toString()}`;

  const res = await fetch(url);
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
    roomId: data.roomId,
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
    roomId: data.roomId,
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

// Admin-specific API functions
export async function updateBookingStatus(
  bookingId: string | number,
  status: string
): Promise<Booking> {
  const res = await fetch(`/api/bookings/${bookingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update booking status");
  return res.json();
}

export async function deleteBooking(bookingId: string | number): Promise<void> {
  const res = await fetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete booking");
}

//  ---- React Query hooks ----

// Fetch bookings
export function useBookings(userId: string | number) {
  return useQuery<Booking[]>({
    queryKey: [BOOKINGS_KEY, userId],
    queryFn: () => fetchBookingsForUser(userId),
    enabled: !!userId,
  });
}

export function useBookingsWithFilters(options: FetchBookingOptions = {}) {
  return useQuery<Booking[]>({
    queryKey: [BOOKINGS_KEY, options],
    queryFn: () => fetchBookings(options),
    enabled: Boolean(
      options.userId || options.from || options.date || options.roomId
    ),
  });
}

// Create booking
export function useCreateBooking(userId?: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["bookings", userId] });
      }
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
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

// Admin-specific hooks
export function useAllBookings() {
  return useQuery<Booking[]>({
    queryKey: [BOOKINGS_KEY, "all"],
    queryFn: () => fetchBookings(),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string | number;
      status: string;
    }) => updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_KEY] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string | number) => deleteBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_KEY] });
    },
  });
}

// Booking stats hook
export function useBookingStats(userId?: number) {
  return useQuery({
    queryKey: ["booking-stats", userId],
    queryFn: () =>
      fetch("/api/user/booking-stats", { credentials: "include" }).then(
        (res) => {
          if (!res.ok) throw new Error("Failed to fetch stats");
          return res.json();
        }
      ),
    enabled: !!userId,
  });
}
