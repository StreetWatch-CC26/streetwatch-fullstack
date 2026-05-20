"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  BarChart3,
  CheckCircle2,
  AlertOctagon,
  Target,
} from "lucide-react";
import { StatCard } from "@/components/overview/StatCard";
import { BarChart } from "@/components/overview/BarChart";
import { CATEGORY_LABEL } from "@/lib/constants";
import type {
  AnalyticsOverview,
  MonthlyTrend,
  CategoryBreakdown,
  DistrictRanking,
} from "@/types/dashboard";

export function AnalyticsSection() {
  // ── States Data ──
  const [overview, setOverview] = useState<AnalyticsOverview>({
    totalReports: 0,
    verifiedReports: 0,
    failReports: 0,
    verificationRate: 0,
  });
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    CategoryBreakdown[]
  >([]);
  const [districtRanking, setDistrictRanking] = useState<DistrictRanking[]>([]);

  // ── States Loading Independen ──
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingDistrict, setLoadingDistrict] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch("/api/analytics?type=overview");
        const json = await res.json();
        if (json.success) setOverview(json.data);
      } catch (err) {
        console.error("Gagal mengambil overview:", err);
      } finally {
        setLoadingOverview(false);
      }
    };

    const fetchTrend = async () => {
      try {
        const res = await fetch("/api/analytics?type=monthly&months=6");
        const json = await res.json();
        if (json.success) setMonthlyTrend(json.data);
      } catch (err) {
        console.error("Gagal mengambil tren:", err);
      } finally {
        setLoadingTrend(false);
      }
    };

    const fetchCategory = async () => {
      try {
        const res = await fetch("/api/analytics?type=categories");
        const json = await res.json();
        if (json.success) setCategoryBreakdown(json.data);
      } catch (err) {
        console.error("Gagal mengambil kategori:", err);
      } finally {
        setLoadingCategory(false);
      }
    };

    // 4. Fetch Lokasi
    const fetchDistrict = async () => {
      try {
        const res = await fetch("/api/analytics?type=locations");
        const json = await res.json();
        if (json.success) setDistrictRanking(json.data);
      } catch (err) {
        console.error("Gagal mengambil lokasi:", err);
      } finally {
        setLoadingDistrict(false);
      }
    };

    fetchOverview();
    fetchTrend();
    fetchCategory();
    fetchDistrict();
  }, []);

  return (
    <div className="space-y-8">
      {/* ── Stat cards ── */}
      <div className="relative min-h-25">
        {loadingOverview ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : null}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={BarChart3}
            label="Total Laporan"
            value={overview.totalReports}
            sub="Semua laporan masuk"
          />
          <StatCard
            icon={CheckCircle2}
            label="Diverifikasi AI"
            value={overview.verifiedReports}
            sub={`${overview.verificationRate}% dari total`}
            accent="bg-green-500"
          />
          <StatCard
            icon={AlertOctagon}
            label="Gagal Diproses"
            value={overview.failReports}
            sub="Gambar tidak valid"
            accent="bg-red-500"
          />
          <StatCard
            icon={Target}
            label="Tingkat Akurasi AI"
            value={`${overview.verificationRate}%`}
          />
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Monthly trend */}
        <div className="relative lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm min-h-75">
          {loadingTrend && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-foreground text-base">
                Tren 6 Bulan Terakhir
              </h2>
              <p className="text-xs text-muted-foreground">
                Laporan Terverifikasi vs Total Masuk
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />{" "}
                Terverifikasi
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary/30 inline-block" />{" "}
                Gagal
              </span>
            </div>
          </div>
          {!loadingTrend && <BarChart data={monthlyTrend} />}
        </div>

        {/* Category breakdown */}
        <div className="relative rounded-2xl border border-border bg-card p-5 shadow-sm min-h-75">
          {loadingCategory && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
          <h2 className="font-heading font-bold text-foreground text-base mb-4">
            Distribusi Kategori
          </h2>
          <div className="space-y-3">
            {!loadingCategory && categoryBreakdown.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Belum ada data kategori.
              </p>
            )}
            {!loadingCategory &&
              categoryBreakdown.map((c) => (
                <div key={c.category}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">
                      {CATEGORY_LABEL[c.category] || c.category}
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

      {/* ── District Heatmap / Ranking ── */}
      <div className="relative rounded-2xl border border-border bg-card p-5 shadow-sm min-h-50">
        {loadingDistrict && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
        <h2 className="font-heading font-bold text-foreground text-base mb-4">
          Ranking Kota/Kabupaten
        </h2>
        <div className="space-y-2">
          {!loadingDistrict && districtRanking.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada data lokasi.
            </p>
          )}
          {!loadingDistrict &&
            districtRanking.map((d, i) => {
              const maxCount = districtRanking[0]._count._all;
              const count = d._count._all;
              return (
                <div key={d.kota} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-mono text-muted-foreground text-right shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-foreground truncate">
                        {d.kota}
                      </span>
                      <span className="text-muted-foreground shrink-0 ml-2">
                        {count} laporan
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
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
    </div>
  );
}
