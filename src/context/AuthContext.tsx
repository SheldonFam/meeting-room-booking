"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, User } from "@/types/models";
import { usePathname } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ["/login"];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const pathname = usePathname();

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/profile", { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      const newUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase() as "admin" | "user",
      };
      setUser(newUser);
      return newUser;
    } catch (err) {
      setUser(null);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  useEffect(() => {
    if (!publicRoutes.includes(pathname)) {
      fetchUser();
    } else {
      setLoading(false); // avoid spinner on public pages
    }
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, error, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
