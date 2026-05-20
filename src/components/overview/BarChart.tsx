import { MonthlyTrend } from "@/types/dashboard";

export function BarChart({ data }: { data: MonthlyTrend[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-muted-foreground text-xs">
        Belum ada data bulanan
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.total), 1);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  return (
    <div className="flex items-end gap-2 h-32 pt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full flex flex-col justify-end gap-0.5"
            style={{ height: "96px" }}
          >
            {/* Gagal (Unverified) */}
            <div
              className="w-full rounded-t-md bg-primary/30 transition-all duration-500"
              style={{ height: `${((d.total - d.verified) / max) * 96}px` }}
              title={`Gagal: ${d.total - d.verified}`}
            />
            {/* Verified */}
            <div
              className="w-full rounded-t-md bg-primary transition-all duration-500"
              style={{ height: `${(d.verified / max) * 96}px` }}
              title={`Terverifikasi: ${d.verified}`}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {monthNames[d.month - 1]}
          </span>
        </div>
      ))}
    </div>
  );
}
