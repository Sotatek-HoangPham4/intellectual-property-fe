"use client";

import MainHeader from "@/shared/components/layout/header/MainHeader";
import AccountSideBar from "@/shared/components/layout/page/settings/account/AccountSideBar";
import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto flex bg-background border rounded-lg">
        <AccountSideBar />
        <div className="w-full px-12 py-8 space-y-12 border-l h-[calc(100vh-120px)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
