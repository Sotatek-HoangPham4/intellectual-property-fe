import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="min-h-screen grid grid-cols-[1fr_580px]">
        {/* Left: Login */}

        <div className="w-full">
          <div className="h-20 px-8 flex items-center gap-2 absolute ">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              {/* <activeTeam.logo className="size-4" /> */}
              <p className="text-2xl font-semibold">S</p>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight truncate">
              {/* <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span> */}
              <p className="text-xl">
                <span className="font-bold">Sign</span>
                <span className="text-muted-foreground">paper</span>
              </p>
            </div>
          </div>
          <div className="min-h-screen flex items-center justify-center">
            {children}
          </div>
        </div>

        {/* Right: Video */}
        <div className="relative overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="https://cdn.dribbble.com/uploads/48226/original/b8bd4e4273cceae2889d9d259b04f732.mp4?1689028949"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
