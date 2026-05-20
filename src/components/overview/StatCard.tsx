import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors sm:mb-0">
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
