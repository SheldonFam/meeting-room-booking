import { useEffect, useState } from "react";

export function useUserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/user/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then(setUser)
      .catch((err) => {
        setUser(null);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}
