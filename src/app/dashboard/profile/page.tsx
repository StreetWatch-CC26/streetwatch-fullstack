"use client";

import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { BadgesTab } from "@/components/profile/BadgesTab";
import { ReportHistoryTab } from "@/components/profile/ReportHistoryTab";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">
        Profil Saya
      </h1>

      <ProfileOverview />

      <Tabs defaultValue="badges">
        <TabsList className="w-full">
          <TabsTrigger value="badges" className="flex-1">
            Badge & Poin
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            Riwayat Laporan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="mt-4">
          <BadgesTab />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <ReportHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
