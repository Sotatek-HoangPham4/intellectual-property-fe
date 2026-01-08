"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/shared/components/ui/button";
import {
  Bell,
  LifeBuoy,
  MonitorSmartphone,
  Settings2,
  User,
  UserCircle,
} from "lucide-react";

const AccountSideBar = () => {
  const user = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  const navItems = [
    { href: "/settings/account", label: "Account", icon: <UserCircle /> },
    {
      href: "/settings/devices",
      label: "Devices",
      icon: <MonitorSmartphone />,
    },
    { href: "/settings/support", label: "Support", icon: <LifeBuoy /> },
    {
      href: "/settings/preferences",
      label: "Preferences",
      icon: <Settings2 />,
    },
    { href: "/settings/notifications", label: "Notifications", icon: <Bell /> },
  ];

  const settingsItems = [
    {
      href: "/settings/preferences",
      label: "Preferences",
      icon: <Settings2 />,
    },
    { href: "/settings/notifications", label: "Notifications", icon: <Bell /> },
  ];

  return (
    <div className="max-w-60 flex flex-col gap-4 h-fit p-2">
      {/* Account Section */}
      <div className="">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Button
              className={`w-full h-9 rounded-md justify-start px-2.5 mb-1 font-normal ${
                pathname === item.href ? "bg-muted" : ""
              }`}
              variant="ghost"
            >
              {item.icon ? (
                <>
                  {item.icon}
                  <p>{item.label}</p>
                </>
              ) : (
                <>
                  <img
                    src={user.user?.avatar!}
                    alt="avatar"
                    className="h-5 w-5 rounded-full"
                  />
                  <p>{user.user?.name || "User"}</p>
                </>
              )}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountSideBar;
