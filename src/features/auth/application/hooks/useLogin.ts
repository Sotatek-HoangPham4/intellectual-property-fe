"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/features/auth/infrastructure/api/authApi";
import { setAuthenticated } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLazyGetMeQuery } from "@/features/user/infrastructure/api/userApi";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loginMutation] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();

  // ✅ STATE RIÊNG cho UX flow
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (data: { email: string; password: string }) => {
    // const toastId = toast.loading("Signing you in...");
    setIsSubmitting(true);

    try {
      // 1️⃣ Login
      const response = await loginMutation(data).unwrap();

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 2️⃣ Get user
      const meResponse = await getMe().unwrap();

      // 3️⃣ Fake UX loading
      await sleep(2000);

      // 4️⃣ Cache user
      dispatch(setAuthenticated(meResponse.data));

      toast.success("Login successfully!");
      await sleep(1000);

      router.push("/home");
    } catch (error: any) {
      toast.error(error?.message || "Login failed!");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login,
    isSubmitting, // 👈 dùng cái này cho button
  };
};
