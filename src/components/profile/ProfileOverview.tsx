"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit3,
  MapPin,
  Trophy,
  Clock,
  CheckCircle2,
  Star,
  Save,
  Lock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileData, StatsData } from "@/types/profile";

export function ProfileOverview() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);

  // State loading dipisah agar tidak saling memblokir
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const [editing, setEditing] = useState(false);
  const [formName, setFormName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/me");
        const json = await res.json();
        if (json.success) {
          setProfile(json.data);
          setFormName(json.data.name ?? "");
        }
      } catch (err) {
        console.error("Gagal mengambil profil", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (err) {
        console.error("Gagal mengambil statistik", err);
      } finally {
        setLoadingStats(false);
      }
    };

    // Dieksekusi paralel tanpa saling tunggu
    fetchProfile();
    fetchStats();
  }, []);

  async function handleSave() {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName }),
      });
      const json = await res.json();
      if (json.success) {
        setProfile((prev) => (prev ? { ...prev, name: json.data.name } : prev));
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const pctToNext = stats?.pctToNext ?? 0;
  const initials = (profile.name ?? profile.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* ── Profile card ── */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 shrink-0">
            {profile.image && (
              <AvatarImage src={profile.image} alt={profile.name ?? ""} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-heading font-bold text-foreground text-lg leading-tight">
                  {profile.name ?? "Pengguna"}
                </h2>

                {/* Fallback skeleton jika stats belum selesai di-fetch */}
                {loadingStats ? (
                  <Skeleton className="h-4 w-24 mt-1" />
                ) : (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                      Lv.{stats?.level.level} · {stats?.level.title}
                    </span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {profile.email}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={() => {
                  setEditing(!editing);
                  setFormName(profile.name ?? "");
                }}
              >
                {editing ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  <Edit3 className="w-3.5 h-3.5" />
                )}
                {editing ? "Batal" : "Edit"}
              </Button>
            </div>

            {/* XP bar */}
            {!loadingStats && stats && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <span>{stats.points} poin</span>
                  {stats.level.next && (
                    <span>Target: {stats.level.next} poin</span>
                  )}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${pctToNext}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Bergabung sejak{" "}
          {format(new Date(profile.createdAt), "MMMM yyyy", { locale: id })}
        </p>

        {/* Edit form */}
        {editing && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Lengkap</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-8 text-sm bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gap-1.5"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-3.5 h-3.5" />
                {saved ? "Tersimpan!" : saving ? "Menyimpan…" : "Simpan"}
              </Button>
              {!profile.hasPassword && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => router.push("/set-password")}
                >
                  <Lock className="w-3.5 h-3.5" /> Set Password
                </Button>
              )}
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
            value: stats?.totalReports ?? 0,
            color: "text-primary",
          },
          {
            icon: CheckCircle2,
            label: "Diselesaikan",
            value: stats?.resolvedReports ?? 0,
            color: "text-green-500",
          },
          {
            icon: Trophy,
            label: "Poin",
            value: stats?.points ?? 0,
            color: "text-yellow-500",
          },
        ].map((s, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-card p-4 text-center"
          >
            {loadingStats ? (
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            ) : (
              <>
                <s.icon className={cn("w-5 h-5 mx-auto mb-1.5", s.color)} />
                <div className="font-heading text-xl font-bold text-foreground">
                  {s.value}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {s.label}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
