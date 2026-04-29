"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  mockUser,
  mockReports,
  URGENCY_COLOR,
  URGENCY_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
} from "@/data/dashboard-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit3,
  MapPin,
  Trophy,
  Clock,
  CheckCircle2,
  Star,
  Save,
  ThumbsUp,
  Camera,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const myReports = mockReports.filter((r) =>
  mockUser.myReportIds.includes(r.id),
);

// Level calculation
function getLevel(points: number) {
  if (points >= 1000) return { level: 5, title: "Legenda Kota", next: null };
  if (points >= 750) return { level: 4, title: "Pejuang Jalan", next: 1000 };
  if (points >= 500) return { level: 3, title: "Aktivis Lokal", next: 750 };
  if (points >= 250) return { level: 2, title: "Warga Peduli", next: 500 };
  return { level: 1, title: "Pelapor Baru", next: 250 };
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [formName, setFormName] = useState(mockUser.name);
  const [formPhone, setFormPhone] = useState(mockUser.phone);
  const [formDistrict, setFormDistrict] = useState(mockUser.district);
  const [saved, setSaved] = useState(false);

  const { level, title, next } = getLevel(mockUser.points);
  const pctToNext = next
    ? Math.round(((mockUser.points - (next - 250)) / 250) * 100)
    : 100;

  function handleSave() {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">
        Profil Saya
      </h1>

      {/* ── Profile card ── */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {mockUser.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Camera className="w-3 h-3 text-primary-foreground" />
            </button>
          </div>

          {/* Name + level */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-heading font-bold text-foreground text-lg leading-tight">
                  {mockUser.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    Lv.{level} · {title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {mockUser.district}, {mockUser.city}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 flex-shrink-0"
                onClick={() => setEditing(!editing)}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {editing ? "Batal" : "Edit"}
              </Button>
            </div>

            {/* XP bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span>{mockUser.points} poin</span>
                {next && <span>Target: {next} poin</span>}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${pctToNext}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Joined */}
        <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Bergabung sejak{" "}
          {format(new Date(mockUser.joinedAt), "MMMM yyyy", { locale: id })}
        </p>

        {/* Edit form */}
        {editing && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Nama Lengkap</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-8 text-sm bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">No. Telepon</Label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="h-8 text-sm bg-background"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Kecamatan / Kelurahan</Label>
              <Input
                value={formDistrict}
                onChange={(e) => setFormDistrict(e.target.value)}
                className="h-8 text-sm bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="gap-1.5" onClick={handleSave}>
                <Save className="w-3.5 h-3.5" />
                {saved ? "Tersimpan!" : "Simpan Perubahan"}
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Ganti Password
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: MapPin,
            label: "Total Laporan",
            value: mockUser.totalReports,
            color: "text-primary",
          },
          {
            icon: CheckCircle2,
            label: "Diselesaikan",
            value: mockUser.resolvedReports,
            color: "text-green-500",
          },
          {
            icon: Trophy,
            label: "Poin",
            value: mockUser.points,
            color: "text-yellow-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-4 text-center"
          >
            <s.icon className={cn("w-5 h-5 mx-auto mb-1.5", s.color)} />
            <div className="font-heading text-xl font-bold text-foreground">
              {s.value}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs: Badges + Riwayat ── */}
      <Tabs defaultValue="badges">
        <TabsList className="w-full">
          <TabsTrigger value="badges" className="flex-1">
            Badge & Poin
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            Riwayat Laporan
          </TabsTrigger>
        </TabsList>

        {/* Badges */}
        <TabsContent value="badges" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mockUser.badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "rounded-2xl border p-4 text-center transition-all",
                  badge.earned
                    ? "border-primary/30 bg-primary/5 hover:border-primary/50"
                    : "border-border bg-muted/30 opacity-50 grayscale",
                )}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div
                  className={cn(
                    "font-heading font-bold text-sm",
                    badge.earned ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {badge.name}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {badge.description}
                </div>
                {badge.earned && (
                  <Badge className="mt-2 text-[9px] bg-primary/10 text-primary border-0 px-2">
                    Diraih ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Points history hint */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-heading font-bold text-foreground text-sm mb-3">
              Cara Dapat Poin
            </h3>
            <div className="space-y-2">
              {[
                { action: "Membuat laporan baru", pts: "+50 poin" },
                { action: "Laporan terverifikasi", pts: "+30 poin" },
                { action: "Laporan diselesaikan", pts: "+100 poin" },
                { action: "Laporan mendapat 10 upvote", pts: "+20 poin" },
              ].map((item) => (
                <div
                  key={item.action}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">{item.action}</span>
                  <span className="font-semibold text-primary">{item.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Report history */}
        <TabsContent value="history" className="mt-4">
          {myReports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Belum ada laporan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReports.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono text-muted-foreground mb-0.5">
                        {r.id}
                      </p>
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {r.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{r.address}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <Badge
                        className={cn("text-[10px]", URGENCY_COLOR[r.urgency])}
                      >
                        {URGENCY_LABEL[r.urgency]}
                      </Badge>
                      <Badge
                        className={cn("text-[10px]", STATUS_COLOR[r.status])}
                      >
                        {STATUS_LABEL[r.status]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {r.upvotes} dukungan
                    </span>
                    <span>
                      {format(new Date(r.createdAt), "d MMM yyyy", {
                        locale: id,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
