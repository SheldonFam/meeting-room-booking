import { useEffect, useState } from "react";

export function useRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/rooms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch rooms");
        return res.json();
      })
      .then(setRooms)
      .catch((err) => {
        setRooms([]);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { rooms, loading, error };
}
