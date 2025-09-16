import { DashboardStats } from "@/types/models";
import { useQuery } from "@tanstack/react-query";

async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard-stats", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
