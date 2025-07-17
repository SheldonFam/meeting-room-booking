"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (
      user.role === "admin" &&
      !pathname.startsWith("/admin") &&
      pathname !== "/login"
    ) {
      router.replace("/admin/dashboard");
    }
    if (user.role === "user" && pathname.startsWith("/admin")) {
      router.replace("/dashboard");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
