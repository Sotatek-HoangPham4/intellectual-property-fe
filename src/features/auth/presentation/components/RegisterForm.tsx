"use client";
import { useForm } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { useRegister } from "@/features/auth/application/registerUseCase";

import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { TbPasswordFingerprint } from "react-icons/tb";
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { useRegisterOTP } from "@/features/auth/application/registerOTPUseCase";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  email: string;
  password: string;
}

interface RegisterFormProps {
  onSuccess: (email: string, password: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { registerOTP, isLoading } = useRegisterOTP();

  const onSubmit = async (data: FormData) => {
    await registerOTP(data);
    onSuccess(data.email, data.password);
  };

  return (
    <div className="space-y-8 w-full max-w-xs">
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
          <p className="font-semibold text-2xl">Create a Resend Account</p>
          <p className="text-muted-foreground">
            Already have an account?
            <Link
              href={"/login"}
              className="text-foreground/100 font-medium ml-1"
            >
              Log in.
            </Link>
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <form className={cn("flex flex-col")} onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...registerField("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="--------"
                {...registerField("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Create Account"}
            </Button>
          </div>
        </form>
        {/* 
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
        </div> */}
      </div>

      <div className="px-10">
        <p className="text-xs text-center text-muted-foreground">
          By signing up, you agree to our
          <Link
            href={"/terms"}
            className="underline underline-offset-2 mx-1 text-foreground"
          >
            Terms
          </Link>
          ,
          <Link
            href={"/terms"}
            className="underline underline-offset-2 mx-1 text-foreground"
          >
            Acceptable Use
          </Link>
          , and{" "}
          <Link
            href={"/terms"}
            className="underline underline-offset-2 mx-1 text-foreground"
          >
            Privacy Policy.
          </Link>
        </p>
      </div>
    </div>
  );
}
