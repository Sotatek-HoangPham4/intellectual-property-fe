"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegister } from "../../application/hooks/useRegister";

type FormData = {
  username: string;
  fullname: string;
  email: string;
  password: string;
};

interface RegisterFormProps {
  onSuccess?: (email: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const { register, isSubmitting } = useRegister();

  const onSubmit = async (data: FormData) => {
    await register(data);
    onSuccess?.(data.email);
  };

  return (
    <div className="space-y-8 w-full max-w-xs">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="font-semibold text-2xl">Create account</p>
          <p className="text-muted-foreground">
            Already have an account?
            <Link href="/login" className="text-foreground font-medium ml-1">
              Log in.
            </Link>
          </p>
        </div>
      </div>

      <form className={cn("flex flex-col")} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="e.g., william.nguyen"
              autoComplete="username"
              {...registerField("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
                maxLength: { value: 32, message: "Maximum 32 characters" },
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fullname">Full name</Label>
            <Input
              id="fullname"
              placeholder="e.g., William Nguyen"
              autoComplete="name"
              {...registerField("fullname", {
                required: "Full name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 80, message: "Maximum 80 characters" },
              })}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., william.nguyen@company.com"
              autoComplete="email"
              inputMode="email"
              {...registerField("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...registerField("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </div>
      </form>

      <div className="px-10">
        <p className="text-xs text-center text-muted-foreground">
          By creating an account, you agree to our
          <Link
            href="/terms"
            className="underline underline-offset-2 mx-1 text-foreground"
          >
            Terms
          </Link>
          ,
          <Link
            href="/terms"
            className="underline underline-offset-2 mx-1 text-foreground"
          >
            Acceptable Use
          </Link>
          , and{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 mx-1 text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
