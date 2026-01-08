"use client";

import { OTPForm } from "@/features/auth/presentation/components/OTPForm";
import { RegisterForm } from "@/features/auth/presentation/components/RegisterForm";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegisterSuccess = (
    registeredEmail: string,
    registeredPassword: string
  ) => {
    setEmail(registeredEmail); // hiển thị OTP form
    setPassword(registeredPassword); // hiển thị OTP form
  };

  return (
    // <div className="relative min-h-svh flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
    //   <div
    //     className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    //     style={{
    //       backgroundImage: "url('/images/background-auth.webp')",
    //     }}
    //   />

    //   <div className="relative z-10 w-full max-w-sm">
    //     {email ? (
    //       <OTPForm email={email} password={password} />
    //     ) : (
    //       <RegisterForm onSuccess={handleRegisterSuccess} />
    //     )}
    //   </div>
    // </div>
    <RegisterForm onSuccess={handleRegisterSuccess} />
  );
}
