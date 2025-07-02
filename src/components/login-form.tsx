import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface LoginFormFields {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

const PROTECTED_PATHS = ["/dashboard", "/calendar", "/rooms", "/my-bookings"];

export function LoginForm({
  className,
  redirectPath = "/dashboard",
  ...props
}: React.ComponentProps<"div"> & { redirectPath?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    mode: "onBlur",
  });

  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const router = useRouter();

  const loginMutation = useMutation<LoginResponse, Error, LoginFormFields>({
    mutationFn: async (data: LoginFormFields) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }
      return res.json();
    },
    onError: (err: Error) => {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed");
    },
    onSuccess: async (data: LoginResponse) => {
      setError(null);
      // Fetch user profile from API after login
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const profile = await res.json();
          setUser({ name: profile.name, role: profile.role });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      if (
        from &&
        PROTECTED_PATHS.some(
          (path) => from === path || from.startsWith(`${path}/`)
        )
      ) {
        router.push(from);
      } else {
        router.push(redirectPath);
      }
    },
  });

  const onSubmit: SubmitHandler<LoginFormFields> = (data) => {
    setError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={loginMutation.isPending} className="contents">
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    loading={loginMutation.isPending}
                    disabled={loginMutation.isPending}
                  >
                    Login
                  </Button>
                </div>
              </div>
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
