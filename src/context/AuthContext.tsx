"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthContextType, User } from "@/types/models";
import { usePathname } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/login"];
const USER_QUERY_KEY = ["user", "profile"];

async function fetchUserProfile(): Promise<User> {
  const res = await fetch("/api/user/profile", { credentials: "include" });
  if (!res.ok) throw new Error("Not authenticated");
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role.toLowerCase() as "admin" | "user",
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const {
    data: user = null,
    isLoading,
    error,
    refetch,
  } = useQuery<User, Error>({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUserProfile,
    enabled: !isPublicRoute,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevents unnecessary refetches
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: false, // Don't retry on auth failure
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
  });

  const fetchUser = useCallback(async () => {
    const result = await refetch();
    return result.data ?? null;
  }, [refetch]);

  const logout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    queryClient.setQueryData(USER_QUERY_KEY, null);
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
  }, [queryClient]);

  // On public routes, don't show loading state
  const loading = isPublicRoute ? false : isLoading;

  return (
    <AuthContext.Provider
      value={{ user, loading, error: error ?? null, fetchUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
