"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bell,
  BookOpen,
  Bot,
  Building2,
  CircleAlert,
  Command,
  FileText,
  Frame,
  GalleryVerticalEnd,
  HelpCircle,
  LayoutDashboard,
  Mails,
  Map,
  PieChart,
  Settings2,
  Signature,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavFooter } from "./nav-footer";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Documents",
      url: "/document",
      icon: FileText,
    },
    {
      name: "Signatures",
      url: "/signature",
      icon: Signature,
    },
    {
      name: "organizations",
      url: "/organization",
      icon: Building2,
    },
    {
      name: "Deliveries",
      url: "/delivery",
      icon: Mails,
    },
    {
      name: "Shared",
      url: "/share",
      icon: Users,
    },
    {
      name: "Requests",
      url: "/request",
      icon: CircleAlert,
    },
  ],
  footer: [
    {
      name: "Notification",
      url: "#",
      icon: Bell,
    },
    {
      name: "Help & Guide",
      url: "#",
      icon: HelpCircle,
    },
  ],
};

export type PersistedUser = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  role: "admin" | "user";
};

export function getPersistedAuth() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("persist:auth");
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed.user) return null;

    // user bị stringify lần nữa
    const user: PersistedUser = JSON.parse(parsed.user);
    return user;
  } catch (err) {
    console.error("Failed to parse persist:auth", err);
    return null;
  }
}

export const ALL_PROJECTS = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Documents",
    url: "/document",
    icon: FileText,
  },
  {
    name: "Signatures",
    url: "/signature",
    icon: Signature,
  },
  {
    name: "Organizations",
    url: "/organization",
    icon: Building2,
  },
  {
    name: "Deliveries",
    url: "/delivery",
    icon: Mails,
  },
  {
    name: "Shared",
    url: "/share",
    icon: Users,
  },
  {
    name: "Requests",
    url: "/request",
    icon: CircleAlert,
  },
];

export const USER_PROJECTS = [
  {
    name: "Documents",
    url: "/document",
    icon: FileText,
  },
  {
    name: "Signatures",
    url: "/signature",
    icon: Signature,
  },
  {
    name: "Deliveries",
    url: "/delivery",
    icon: Mails,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [projects, setProjects] = React.useState(ALL_PROJECTS);

  React.useEffect(() => {
    const user = getPersistedAuth();

    if (!user) {
      setProjects(USER_PROJECTS);
      return;
    }

    if (user.role === "admin") {
      setProjects(ALL_PROJECTS);
    } else {
      setProjects(USER_PROJECTS);
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter projects={data.footer} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
