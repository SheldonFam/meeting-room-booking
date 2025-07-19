import { useState } from "react";
import { CreateBookingPayload } from "@/types/models";

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBooking = async (payload: CreateBookingPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create booking");
      }
      return await res.json();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err);
      else setError(new Error("Unknown error"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
}
