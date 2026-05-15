"use client";

import * as React from "react";

import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { VersionSwitcher } from "./VersionSwitcher";
import { NavSecondary } from "./NavSecondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  RiPieChartLine,
  RiCompassDiscoverLine,
  // RiFlaskLine,
  RiFileChartLine,
  RiAccountCircle2Line,
  RiGlobalLine,
} from "@remixicon/react";
import { useSession } from "next-auth/react";

const data = {
  versions: ["1.0.0"],

  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: RiPieChartLine,
      items: [
        {
          title: "Statistik",
          url: "/dashboard/overview",
        },
        // {
        //   title: "Aktivitas Terbaru",
        //   url: "/dashboard/overview/activity",
        // },
      ],
    },
    {
      title: "Peta",
      url: "/dashboard/map",
      icon: RiCompassDiscoverLine,
      items: [
        {
          title: "Lihat Peta",
          url: "/dashboard/map",
        },
        // {
        //   title: "Titik Laporan",
        //   url: "/dashboard/map/reports",
        // },
        // {
        //   title: "Area Monitoring",
        //   url: "/dashboard/map/monitoring",
        // },
      ],
    },
    {
      title: "Laporan",
      url: "/dashboard/reports",
      icon: RiFileChartLine,
      items: [
        {
          title: "Semua Laporan",
          url: "/dashboard/reports",
        },
        {
          title: "Buat Laporan",
          url: "/dashboard/reports/new",
        },
        // {
        //   title: "Riwayat Laporan",
        //   url: "/dashboard/report/history",
        // },
      ],
    },

    {
      title: "Profil",
      url: "/dashboard/profile",
      icon: RiAccountCircle2Line,
      items: [
        {
          title: "Informasi Akun",
          url: "/dashboard/profile",
        },
        // {
        //   title: "Pengaturan",
        //   url: "/dashboard/profile/settings",
        // },
        // {
        //   title: "Keamanan",
        //   url: "/dashboard/profile/security",
        // },
      ],
    },

    // {
    //   title: "StreetWatch AI",
    //   url: "/dashboard/playground",
    //   icon: RiFlaskLine,
    //   items: [
    //     {
    //       title: "Analisis Gambar",
    //       url: "/dashboard/playground",
    //     },
    //     // {
    //     //   title: "Analisis AI",
    //     //   url: "/dashboard/playground/analyze",
    //     // },
    //     // {
    //     //   title: "Riwayat AI",
    //     //   url: "/dashboard/playground/history",
    //     // },
    //   ],
    // },
  ],

  navSecondary: [
    {
      title: "Public Site",
      url: "/",
      icon: RiGlobalLine,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();

  const currentUser = {
    name: session?.user?.name || "Memuat...",
    email: session?.user?.email || "",
    // NextAuth menggunakan properti 'image', mapping ke 'avatar' sesuai kebutuhan komponenmu
    avatar: session?.user?.image || "/avatars/default-avatar.png",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {status === "loading" ? (
          <div className="p-4 text-sm text-muted-foreground">
            Memuat data...
          </div>
        ) : (
          <NavUser user={currentUser} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
