"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  // FrameIcon,
  // PieChartIcon,
  // MapIcon,
} from "lucide-react";

import {
  RiPieChartLine,
  RiCompassDiscoverLine,
  RiFlaskLine,
  RiAddCircleLine,
  RiAccountCircle2Line,
} from "@remixicon/react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Street Watch Team",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: <RiPieChartLine />,
    },
    {
      title: "Peta",
      url: "/dashboard/map",
      icon: <RiCompassDiscoverLine />,
    },
    {
      title: "Buat Laporan",
      url: "/dashboard/report/new",
      icon: <RiAddCircleLine />,
    },

    {
      title: "Profil",
      url: "/dashboard/profile",
      icon: <RiAccountCircle2Line />,
    },
    {
      title: "StreetWatch AI",
      url: "/dashboard/playground",
      icon: <RiFlaskLine />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
