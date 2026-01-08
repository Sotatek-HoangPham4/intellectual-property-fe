"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/features/auth/infrastructure/api/authApi";
import { clearCredentials } from "@/store/slices/authSlice";
import { authApi } from "@/features/auth/infrastructure/api/authApi";
import toast from "react-hot-toast";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();

      dispatch(clearCredentials());

      dispatch(authApi.util.resetApiState());

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.message || "Logout failed");
    }
  };

  return { logout, isLoading };
};
