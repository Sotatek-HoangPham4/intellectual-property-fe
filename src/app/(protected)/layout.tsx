"use client";

// import { useRequireAuth } from "@/features/auth/presentation/hooks/useRequireAuth";
// import { RootState } from "@/store";
// import { ReactNode } from "react";
// import { useSelector } from "react-redux";

// export default function ProtectedLayout({ children }: { children: ReactNode }) {
//   // const { loading } = useRequireAuth({
//   //   redirectIfUnauthenticated: "/login",
//   // });

//   // const auth = useSelector((state: RootState) => state.auth);
//   // console.log(auth);

//   // if (loading) return <div>LoadingProtectedLayout...</div>;

//   return <>{children}</>;
// }

import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRequireAuth } from "@/features/auth/presentation/hooks/useRequireAuth";
import { RootState } from "@/store";
import { Search, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { loading } = useRequireAuth({
  //   redirectIfUnauthenticated: "/login",
  // });

  // const auth = useSelector((state: RootState) => state.auth);
  // console.log(auth);

  // if (loading) return <div>LoadingProtectedLayout...</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header> */}
        <main className="min-h-screen bg-muted">
          <div className="fixed w-[calc(100vw-256px)] h-16 bg-white flex items-center justify-between px-6 border-b">
            <div className="flex items-center gap-2">
              <Input
                leftIcon={<Search size={20} />}
                placeholder="Search"
                className="w-80"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant={"outline"} className="text-xs" size={"sm"}>
                <UserPlus />
                Invite Members
              </Button>
              <NavUser />
            </div>
          </div>
          <div className="pt-16">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
