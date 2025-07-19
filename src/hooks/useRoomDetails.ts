import { useState, useEffect } from "react";
import type { RoomDetails } from "@/types/models";

export function useRoomDetails(roomId: string) {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/rooms/${roomId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch room details");
        return res.json();
      })
      .then((data) => {
        setRoomDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        setRoomDetails(null);
        setError(err);
        setLoading(false);
      });
  }, [roomId]);

  return { roomDetails, loading, error };
}
