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
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import type {
  LoginFormFields,
  UserRole,
  LoginResponse,
  FormFieldProps,
} from "@/types/models";

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  user: "/dashboard",
};

function getRedirectPath(role: UserRole, from?: string): string {
  if (from) return from; // trust server-provided redirect if safe
  return ROLE_HOME[role];
}

function FormField({
  id,
  label,
  type = "text",
  autoComplete,
  register,
  error,
}: FormFieldProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...register}
      />
      {error && (
        <span id={`${id}-error`} className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

export function LoginForm({ className }: { className?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    mode: "onBlur",
  });

  const { fetchUser } = useAuth();
  const router = useRouter();

  const loginMutation = useMutation<LoginResponse, Error, LoginFormFields>({
    mutationFn: async (formData: LoginFormFields) => {
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
    },
    onError: (err: Error) => {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed");
    },
    onSuccess: async () => {
      // Fetch user profile from API after login
      const profile = await fetchUser();

      if (!profile) {
        // handle case where user couldn't be fetched
        console.error("Failed to fetch user profile after login");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      router.push(getRedirectPath(profile.role, from || undefined));
    },
  });

  const onSubmit: SubmitHandler<LoginFormFields> = (formData) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
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
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  error={errors.email?.message}
                />
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  register={register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={errors.password?.message}
                />
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
