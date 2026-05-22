// src/components/reports/AIAnalysisCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, AlertTriangle, ShieldCheck } from "lucide-react";
import type { ReportDetail } from "@/types/report";

interface AIAnalysisCardProps {
  report: ReportDetail;
}

export function AIAnalysisCard({ report }: AIAnalysisCardProps) {
  const isFailed = report.status === "fail";

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm ">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-primary">
          <BrainCircuit className="w-5 h-5" />
          Validasi Sistem AI
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {isFailed ? (
          <div className="flex flex-col items-center py-6 text-center bg-background/50 rounded-lg border border-destructive/20">
            <AlertTriangle className="w-8 h-8 text-destructive mb-3" />
            <p className="text-sm font-bold text-destructive">
              Gagal Diverifikasi
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-50">
              AI tidak menemukan kerusakan relevan pada foto, atau gambar buram.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground">
                Tingkat Urgensi
              </span>
              <Badge
                // high = destructive, medium = warning, low = default
                variant={
                  report.urgency === "high"
                    ? "destructive"
                    : report.urgency === "medium"
                      ? "warning"
                      : "default"
                }
              >
                {report.urgency?.toUpperCase() || "N/A"}
              </Badge>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-lg border border-border text-center">
              <ShieldCheck className="w-6 h-6 text-primary mb-2" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                AI Confidence Score
              </p>
              <div className="text-3xl font-black text-foreground">
                {report.aiScore ? `${report.aiScore}%` : "N/A"}
              </div>
            </div>

            {report.aiSummary && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                  Ringkasan Deteksi
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed bg-background/50 p-3 rounded-lg border border-border">
                  {report.aiSummary}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
