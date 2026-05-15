/**
 * components/dashboard/MapLegend.tsx
 */

import { Urgency } from "@/generated/prisma/enums";

const URGENCY_ITEMS: { urgency: Urgency; label: string; hex: string }[] = [
  { urgency: "high", label: "Tinggi", hex: "#ef4444" },
  { urgency: "medium", label: "Sedang", hex: "#eab308" },
  { urgency: "low", label: "Rendah", hex: "#22c55e" },
];

export function MapLegend() {
  return (
    <div className="bg-background/90 backdrop-blur-md border border-border rounded-xl px-3 py-2.5 shadow-lg pointer-events-none select-none">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">
        Kerusakan
      </p>
      <div className="space-y-1.5">
        {URGENCY_ITEMS.map(({ urgency, label, hex }) => (
          <div key={urgency} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: hex }}
            />
            <span className="text-[10px] text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
