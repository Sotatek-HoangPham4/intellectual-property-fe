"use client";

import { useForm } from "react-hook-form";
import { cn } from "@/shared/lib/utils";

import { Label } from "../../../../shared/components/ui/label";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { TbPasswordFingerprint } from "react-icons/tb";
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "../../application/hooks/useLogin";
import { Loader2 } from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { login, isSubmitting } = useLogin();

  const onSubmit = async (data: FormData) => {
    await login(data);
  };

  const authState = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8 w-full max-w-xs">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="font-semibold text-2xl">Login to your account</p>
          <p className="text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <form
          className={cn("flex flex-col gap-6", className)}
          onSubmit={handleSubmit(onSubmit)}
          {...props}
        >
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="--------"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="relative text-center text-sm">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>

          <Button variant="outline" className="w-full">
            <FaGoogle /> Google
          </Button>
          <div className="space-y-2">
            <p className="text-center text-muted-foreground text-xs">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
            <div className="text-center text-muted-foreground text-xs">
              Don't have an account?{" "}
              <a href="/register" className="underline underline-offset-2">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
