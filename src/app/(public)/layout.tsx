"use client";

import { useRequireAuth } from "@/features/auth/presentation/hooks/useRequireAuth";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  // const { loading } = useRequireAuth({
  //   redirectIfAuthenticated: "/home",
  // });

  // // ⚡️ chưa load xong thì không render gì → tránh flash login page
  // if (loading) return <>Loadinggg</>;

  return <>{children}</>;
}
