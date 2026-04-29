"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  mockReports,
  mockMonthlyTrend,
  mockCategoryBreakdown,
  mockDistrictRanking,
  URGENCY_LABEL,
  URGENCY_COLOR,
  URGENCY_DOT,
  STATUS_LABEL,
  STATUS_COLOR,
  type Urgency,
  type ReportStatus,
  type DamageCategory,
  CATEGORY_LABEL,
} from "@/data/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Search,
  MapPin,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors sm:mb-0 ">
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
          accent ?? "bg-primary/10",
        )}
      >
        <Icon
          className={cn("w-4.5 h-4.5", accent ? "text-white" : "text-primary")}
        />
      </div>
      <div className="font-heading text-2xl font-bold text-foreground leading-none mb-1">
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {sub && (
        <div className="text-[10px] text-primary mt-0.5 font-medium">{sub}</div>
      )}
    </div>
  );
}

// ── Bar chart (pure CSS) ──────────────────────────────────────────────────────
function BarChart({ data }: { data: typeof mockMonthlyTrend }) {
  const max = Math.max(...data.map((d) => d.total));
  return (
    <div className="flex items-end gap-2 h-32 pt-2">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full flex flex-col justify-end gap-0.5"
            style={{ height: "96px" }}
          >
            <div
              className="w-full rounded-t-md bg-primary/30 transition-all duration-500"
              style={{ height: `${(d.resolved / max) * 96}px` }}
            />
            <div
              className="w-full rounded-t-md bg-primary transition-all duration-500"
              style={{ height: `${((d.total - d.resolved) / max) * 96}px` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<DamageCategory | "all">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"date" | "upvotes" | "urgency">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const totalReports = mockReports.length;
  const resolved = mockReports.filter((r) => r.status === "resolved").length;
  const critical = mockReports.filter((r) => r.urgency === "critical").length;
  const inProgress = mockReports.filter(
    (r) => r.status === "in_progress",
  ).length;

  const urgencyOrder: Record<Urgency, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const filteredReports = mockReports
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q);
      const matchUrgency =
        urgencyFilter === "all" || r.urgency === urgencyFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchCat =
        categoryFilter === "all" || r.category === categoryFilter;
      return matchSearch && matchUrgency && matchStatus && matchCat;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date")
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortBy === "upvotes") cmp = a.upvotes - b.upvotes;
      else if (sortBy === "urgency")
        cmp = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      return sortDir === "desc" ? -cmp : cmp;
    });

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-8 ">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Gambaran keseluruhan laporan di kotamu
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={BarChart3}
          label="Total Laporan"
          value={totalReports}
          sub={`+14 bulan ini`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Diselesaikan"
          value={resolved}
          sub={`${Math.round((resolved / totalReports) * 100)}% dari total`}
        />
        <StatCard
          icon={AlertOctagon}
          label="Status Kritis"
          value={critical}
          sub="Butuh perhatian segera"
        />
        <StatCard icon={Clock} label="Dalam Perbaikan" value={inProgress} />
      </div>

      {/* ── Charts row ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Monthly trend */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-foreground text-base">
                Tren 6 Bulan
              </h2>
              <p className="text-xs text-muted-foreground">
                Total vs diselesaikan
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />{" "}
                Aktif
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary/30 inline-block" />{" "}
                Selesai
              </span>
            </div>
          </div>
          <BarChart data={mockMonthlyTrend} />
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading font-bold text-foreground text-base mb-4">
            Kategori
          </h2>
          <div className="space-y-3">
            {mockCategoryBreakdown.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">
                    {c.category}
                  </span>
                  <span className="text-muted-foreground">
                    {c.count} ({c.pct}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── District heatmap / ranking ── */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-heading font-bold text-foreground text-base mb-4">
          Ranking Kecamatan
        </h2>
        <div className="space-y-2">
          {mockDistrictRanking.map((d, i) => {
            const resolvePct = Math.round((d.resolved / d.count) * 100);
            const maxCount = mockDistrictRanking[0].count;
            return (
              <div key={d.district} className="flex items-center gap-3">
                <span className="w-5 text-xs font-mono text-muted-foreground text-right flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-foreground truncate">
                      {d.district}
                    </span>
                    <span className="text-muted-foreground flex-shrink-0 ml-2">
                      {d.count} laporan · {resolvePct}% selesai
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(d.count / maxCount) * 100}%`,
                        background: `linear-gradient(to right, var(--primary), oklch(0.6 0.118 184.704))`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Report list with filters ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-heading font-bold text-foreground text-base mb-3">
            Daftar Laporan
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari alamat, judul…"
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>
            <Select
              value={urgencyFilter}
              onValueChange={(v) => setUrgencyFilter(v as any)}
            >
              <SelectTrigger className="h-8 text-xs w-[110px] bg-background">
                <SelectValue placeholder="Urgensi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Urgensi</SelectItem>
                {(["critical", "high", "medium", "low"] as Urgency[]).map(
                  (u) => (
                    <SelectItem key={u} value={u}>
                      {URGENCY_LABEL[u]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as any)}
            >
              <SelectTrigger className="h-8 text-xs w-[130px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {(
                  [
                    "pending",
                    "verified",
                    "in_progress",
                    "resolved",
                  ] as ReportStatus[]
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as any)}
            >
              <SelectTrigger className="h-8 text-xs w-[110px] bg-background">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[1fr_120px_120px_90px_80px] gap-3 px-4 py-2 bg-muted/30 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Laporan</span>
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => toggleSort("urgency")}
          >
            Urgensi{" "}
            {sortBy === "urgency" ? (
              sortDir === "desc" ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )
            ) : null}
          </button>
          <span>Status</span>
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => toggleSort("upvotes")}
          >
            Dukungan{" "}
            {sortBy === "upvotes" ? (
              sortDir === "desc" ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )
            ) : null}
          </button>
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => toggleSort("date")}
          >
            Tanggal{" "}
            {sortBy === "date" ? (
              sortDir === "desc" ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )
            ) : null}
          </button>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {filteredReports.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Tidak ada laporan yang sesuai filter.
            </div>
          ) : (
            filteredReports.map((r) => (
              <div
                key={r.id}
                className="px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer md:grid md:grid-cols-[1fr_120px_120px_90px_80px] md:gap-3 md:items-center"
              >
                {/* Title & location */}
                <div className="mb-2 md:mb-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {r.id}
                    </span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                      {CATEGORY_LABEL[r.category]}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {r.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{r.address}</span>
                  </div>
                </div>

                {/* Mobile badges */}
                <div className="flex flex-wrap gap-1.5 md:hidden mb-1">
                  <Badge
                    className={cn("text-[10px] px-2", URGENCY_COLOR[r.urgency])}
                  >
                    {URGENCY_LABEL[r.urgency]}
                  </Badge>
                  <Badge
                    className={cn("text-[10px] px-2", STATUS_COLOR[r.status])}
                  >
                    {STATUS_LABEL[r.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {r.upvotes}
                  </span>
                </div>

                {/* Desktop cells */}
                <div className="hidden md:flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn("w-2 h-2 rounded-full flex-shrink-0", {
                        "bg-red-500": r.urgency === "critical",
                        "bg-orange-500": r.urgency === "high",
                        "bg-yellow-500": r.urgency === "medium",
                        "bg-green-500": r.urgency === "low",
                      })}
                    />
                    <Badge
                      className={cn("text-[10px]", URGENCY_COLOR[r.urgency])}
                    >
                      {URGENCY_LABEL[r.urgency]}
                    </Badge>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Badge className={cn("text-[10px]", STATUS_COLOR[r.status])}>
                    {STATUS_LABEL[r.status]}
                  </Badge>
                </div>
                <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" /> {r.upvotes}
                </div>
                <div className="hidden md:block text-xs text-muted-foreground">
                  {format(new Date(r.createdAt), "d MMM", { locale: id })}
                </div>
              </div>
            ))
          )}
        </div>

        {filteredReports.length > 0 && (
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
            Menampilkan {filteredReports.length} dari {mockReports.length}{" "}
            laporan
          </div>
        )}
      </div>
    </div>
  );
}
