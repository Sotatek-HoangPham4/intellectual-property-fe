"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLazyGetMeQuery,
  useRegisterMutation,
} from "@/features/auth/infrastructure/api/authApi";
import { setAuthenticated } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useRegister = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [registerMutation] = useRegisterMutation();
  const [getMe] = useLazyGetMeQuery();

  // ✅ STATE RIÊNG cho UX flow
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = async (data: { email: string; password: string }) => {
    // const toastId = toast.loading("Signing you in...");
    setIsSubmitting(true);

    try {
      const response = await registerMutation(data).unwrap();

      await sleep(2000);

      toast.success("Register successfully!");
      await sleep(1000);

      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Register failed!");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    isSubmitting, // 👈 dùng cái này cho button
  };
};
