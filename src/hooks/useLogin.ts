import { useAuth } from "@/context/AuthContext";
import { LoginFormFields, LoginResponse, UserRole } from "@/types/models";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  user: "/dashboard",
};

function getRedirectPath(role: UserRole, from?: string): string {
  if (from) return from; // trust server-provided redirect if safe
  return ROLE_HOME[role];
}

async function loginApi(formData: LoginFormFields): Promise<LoginResponse> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }

  return res.json();
}

export function useLogin() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  return useMutation<LoginResponse, Error, LoginFormFields>({
    mutationFn: loginApi,
    onSuccess: async () => {
      const profile = await fetchUser();
      if (!profile) return;
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      router.push(getRedirectPath(profile.role, from || undefined));
    },
    onError: (err: Error) => {
      toast.error(err.message || "Login failed");
    },
  });
}
