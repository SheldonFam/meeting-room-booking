import { useEffect, useState } from "react";
import { Booking } from "@/types/models";

interface UseBookingsOptions {
  userId?: number;
  from?: string;
  date?: string;
  roomId?: number;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let url = "/api/bookings";
    const params = new URLSearchParams();
    if (options.userId) params.append("userId", options.userId.toString());
    if (options.from) params.append("from", options.from);
    if (options.date) params.append("date", options.date);
    if (options.roomId) params.append("roomId", options.roomId.toString());
    if (Array.from(params).length) url += `?${params.toString()}`;

    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then(setBookings)
      .catch((err) => {
        setBookings([]);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [options.userId, options.from, options.date, options.roomId]);

  return { bookings, loading, error };
}
