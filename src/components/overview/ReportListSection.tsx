"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
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
  Search,
  MapPin,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  URGENCY_LABEL,
  URGENCY_COLOR,
  STATUS_LABEL,
  STATUS_COLOR,
  CATEGORY_LABEL,
} from "@/lib/constants";
import type { ReportItem } from "@/types/dashboard";

export function ReportListSection() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "upvotes">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (urgencyFilter !== "all") params.append("urgency", urgencyFilter);
        if (statusFilter !== "all") params.append("status", statusFilter);
        if (categoryFilter !== "all") params.append("category", categoryFilter);

        const sortValue =
          sortBy === "date"
            ? sortDir === "desc"
              ? "createdAt_desc"
              : "createdAt_asc"
            : "upvoteCount_desc";

        params.append("sort", sortValue);
        params.append("limit", "50");

        const res = await fetch(`/api/reports?${params.toString()}`);
        const json = await res.json();

        if (json.success) setReports(json.data);
      } catch (err) {
        console.error("Gagal mengambil daftar laporan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [urgencyFilter, statusFilter, categoryFilter, sortBy, sortDir]);

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  }

  const filteredReports = reports.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q) ||
      r.kota?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border">
        <h2 className="font-heading font-bold text-foreground text-base mb-3">
          Daftar Laporan Terkini
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari alamat, judul…"
              className="pl-8 h-8 text-xs bg-background"
            />
          </div>
          <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
            <SelectTrigger className="h-8 text-xs w-27.5 bg-background">
              <SelectValue placeholder="Urgensi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Urgensi</SelectItem>
              {Object.entries(URGENCY_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs w-32.5 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 text-xs w-27.5 bg-background">
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

      <div className="hidden md:grid grid-cols-[1fr_120px_120px_90px_80px] gap-3 px-4 py-2 bg-muted/30 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        <span>Laporan</span>
        <span>Urgensi</span>
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

      <div className="divide-y divide-border relative min-h-25">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {!loading && filteredReports.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Tidak ada laporan yang sesuai filter.
          </div>
        ) : (
          filteredReports.map((r) => (
            <div
              key={r.id}
              className="px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer md:grid md:grid-cols-[1fr_120px_120px_90px_80px] md:gap-3 md:items-center"
            >
              <div className="mb-2 md:mb-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-20">
                    {r.id}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                    {CATEGORY_LABEL[r.category] || r.category}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {r.title}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {r.address}, {r.kota}
                  </span>
                </div>
              </div>

              {/* Mobile badges */}
              <div className="flex flex-wrap gap-1.5 md:hidden mb-1">
                {r.urgency && (
                  <Badge
                    className={cn("text-[10px] px-2", URGENCY_COLOR[r.urgency])}
                  >
                    {URGENCY_LABEL[r.urgency]}
                  </Badge>
                )}
                <Badge
                  className={cn("text-[10px] px-2", STATUS_COLOR[r.status])}
                >
                  {STATUS_LABEL[r.status]}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> {r.upvoteCount}
                </span>
              </div>

              {/* Desktop cells */}
              <div className="hidden md:flex items-center">
                {r.urgency ? (
                  <Badge
                    className={cn("text-[10px]", URGENCY_COLOR[r.urgency])}
                  >
                    {URGENCY_LABEL[r.urgency]}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </div>
              <div className="hidden md:block">
                <Badge className={cn("text-[10px]", STATUS_COLOR[r.status])}>
                  {STATUS_LABEL[r.status]}
                </Badge>
              </div>
              <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                <ThumbsUp className="w-3 h-3" /> {r.upvoteCount}
              </div>
              <div className="hidden md:block text-xs text-muted-foreground">
                {format(new Date(r.createdAt), "d MMM yyyy", { locale: id })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
