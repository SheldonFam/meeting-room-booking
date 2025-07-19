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
import type { UseFormRegisterReturn } from "react-hook-form";

interface LoginFormFields {
  email: string;
  password: string;
}

type UserRole = "admin" | "user";
interface LoginResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

function getRedirectPath(role: UserRole, from?: string): string {
  const defaultPath = role === "admin" ? "/admin/dashboard" : "/dashboard";
  if (
    from &&
    ((role === "admin" && from.startsWith("/admin")) ||
      (role === "user" && !from.startsWith("/admin")))
  ) {
    return from;
  }
  return defaultPath;
}

interface FormFieldProps {
  id: keyof LoginFormFields;
  label: string;
  type?: string;
  autoComplete?: string;
  register: UseFormRegisterReturn;
  error?: string;
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

  const { setUser } = useAuth();
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
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const profile = await res.json();
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
          });
          const params = new URLSearchParams(window.location.search);
          const from = params.get("from");
          router.push(getRedirectPath(profile.role, from || undefined));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
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
          {loginMutation.isError && (
            <div className="text-red-500 text-sm mb-2" role="alert">
              {(loginMutation.error as Error)?.message || "Login failed"}
            </div>
          )}
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
