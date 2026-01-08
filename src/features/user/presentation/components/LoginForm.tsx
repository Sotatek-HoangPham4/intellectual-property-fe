"use client";

import { useForm } from "react-hook-form";
import { cn } from "@/shared/lib/utils";

import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { TbPasswordFingerprint } from "react-icons/tb";
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLogin } from "@/features/auth/application/hooks/useLogin";

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
  const { login, isLoading } = useLogin();

  const onSubmit = async (data: FormData) => {
    await login(data);
  };

  const authState = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6">
        <div className="h-12 w-12 flex items-center justify-center p-2  border rounded-xl">
          <Image
            src={"/icons/logo-only.svg"}
            alt="logo-only"
            width={36}
            height={36}
            className="hover:scale-110 transition-all duration-150 cursor-pointer"
          />
        </div>
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
                startIcon={<MdEmail />}
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
                startIcon={<TbPasswordFingerprint />}
                placeholder="--------"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="w-full">
              <FaGoogle />
            </Button>
            <Button variant="outline" className="w-full">
              <FaFacebookF />
            </Button>
            <Button variant="outline" className="w-full">
              <FaApple />
            </Button>
          </div>
          <div className="text-center text-xs">
            Don't have an account?{" "}
            <a href="/register" className="underline underline-offset-2">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
