"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContextType } from "@/types/models";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user info from API on mount
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role.toLowerCase() as "admin" | "user",
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    // Optionally, call your logout API and redirect
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
