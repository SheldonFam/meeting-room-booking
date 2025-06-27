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

interface LoginFormFields {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    mode: "onBlur",
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormFields) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }
      return res.json();
    },
    onError: (err: any) => {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setError(null);
      router.push("/dashboard");
      // TODO: handle successful login (e.g., redirect, set user state)
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
              {error && (
                <div className="text-sm text-red-600 text-center">{error}</div>
              )}
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
