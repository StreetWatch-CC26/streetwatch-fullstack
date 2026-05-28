import { ExportFilters, ReportItem } from "@/types/report";
import { getPriorityTier, formatScore, PRIORITY_TIERS } from "@/lib/priority";
import { formatDateLong, formatDate } from "./utils";

export async function generatePDF(
  reports: (ReportItem & { priorityScore: number })[],
  filters: ExportFilters,
  meta: { total: number; generatedAt: string },
) {
  // Dynamic import — jsPDF ~200KB, hanya dimuat saat export
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const MARGIN = 18;
  const CONTENT_W = W - MARGIN * 2;

  // ── Color palette ──────────────────────────────────────────────────────────
  const C = {
    primary: [15, 118, 110] as [number, number, number], // teal-700
    dark: [15, 23, 42] as [number, number, number], // slate-900
    muted: [100, 116, 139] as [number, number, number], // slate-500
    border: [226, 232, 240] as [number, number, number], // slate-200
    white: [255, 255, 255] as [number, number, number],
    kritis: [220, 38, 38] as [number, number, number], // red-600
    tinggi: [234, 88, 12] as [number, number, number], // orange-600
    sedang: [217, 119, 6] as [number, number, number], // amber-600
    rendah: [22, 163, 74] as [number, number, number], // green-600
    bgLight: [248, 250, 252] as [number, number, number], // slate-50
  };

  function tierColor(score: number): [number, number, number] {
    if (score >= 0.75) return C.kritis;
    if (score >= 0.5) return C.tinggi;
    if (score >= 0.25) return C.sedang;
    return C.rendah;
  }

  // ── PAGE 1: Cover ──────────────────────────────────────────────────────────

  // Header bar
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, W, 42, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...C.white);
  doc.text("StreetWatch", MARGIN, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 220, 215);
  doc.text("Sistem Pelaporan & Pemantauan Kerusakan Jalan", MARGIN, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...C.white);
  doc.text("Laporan Prioritas Perbaikan Jalan", MARGIN, 35);

  // Generated at — top right
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 220, 215);
  doc.text(`Digenerate: ${formatDateLong(meta.generatedAt)}`, W - MARGIN, 35, {
    align: "right",
  });

  let y = 54;

  // ── Summary boxes ──────────────────────────────────────────────────────────
  const tierCounts = PRIORITY_TIERS.map((tier) => ({
    ...tier,
    count: reports.filter(
      (r) => getPriorityTier(r.priorityScore).label === tier.label,
    ).length,
  }));

  const boxW = (CONTENT_W - 9) / 4;
  tierCounts.forEach((tier, i) => {
    const x = MARGIN + i * (boxW + 3);
    doc.setFillColor(...C.bgLight);
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, boxW, 22, 2, 2, "FD");

    // Color bar top
    const rgb = tierColor(tier.minScore + 0.01);
    doc.setFillColor(...rgb);
    doc.roundedRect(x, y, boxW, 4, 2, 2, "F");
    doc.rect(x, y + 2, boxW, 2, "F"); // flatten bottom

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...C.dark);
    doc.text(String(tier.count), x + boxW / 2, y + 14, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(tier.label.toUpperCase(), x + boxW / 2, y + 19.5, {
      align: "center",
    });
  });

  y += 30;

  // ── Filter info ────────────────────────────────────────────────────────────
  doc.setFillColor(...C.bgLight);
  doc.setDrawColor(...C.border);
  doc.roundedRect(MARGIN, y, CONTENT_W, 20, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.dark);
  doc.text("Filter Aktif", MARGIN + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);

  const filterTexts: string[] = [];
  if (filters.dateFrom || filters.dateTo) {
    filterTexts.push(
      `Periode: ${filters.dateFrom ? formatDate(filters.dateFrom) : "—"} s/d ${filters.dateTo ? formatDate(filters.dateTo) : "—"}`,
    );
  } else {
    filterTexts.push("Periode: Semua waktu");
  }
  if (filters.provinsi) filterTexts.push(`Provinsi: ${filters.provinsi}`);
  if (filters.kota) filterTexts.push(`Kota/Kab: ${filters.kota}`);
  if (filters.urgency) filterTexts.push(`Keparahan AI: ${filters.urgency}`);
  filterTexts.push(`Total: ${meta.total} laporan`);

  doc.text(filterTexts.join("   ·   "), MARGIN + 5, y + 15);

  y += 28;

  // ── Subtitle ───────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.dark);
  doc.text("Daftar Laporan (Diurutkan Berdasarkan Skor Prioritas)", MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text(
    "Skor Prioritas = (Tingkat Keparahan AI × 60%) + (Dukungan Warga / 50 × 40%)",
    MARGIN,
    y + 5.5,
  );

  y += 12;

  // ── Table ──────────────────────────────────────────────────────────────────
  const tableRows = reports.map((r, idx) => {
    const tier = getPriorityTier(r.priorityScore);
    return [
      String(idx + 1),
      r.title.length > 42 ? r.title.substring(0, 42) + "…" : r.title,
      [r.kecamatan, r.kota].filter(Boolean).join(", ") ||
        r.address.substring(0, 30),
      r.urgency.toUpperCase(),
      String(r.upvoteCount),
      `${formatScore(r.priorityScore)}`,
      tier.labelShort,
      formatDate(r.createdAt),
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [
      [
        "#",
        "Judul Laporan",
        "Lokasi",
        "AI",
        "Upvote",
        "Skor",
        "Tier",
        "Tanggal",
      ],
    ],
    body: tableRows,
    styles: {
      fontSize: 7,
      cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 },
      textColor: C.dark,
      lineColor: C.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: C.primary,
      textColor: C.white,
      fontStyle: "bold",
      fontSize: 7.5,
    },
    alternateRowStyles: {
      fillColor: C.bgLight,
    },
    columnStyles: {
      0: { cellWidth: 7, halign: "center" },
      1: { cellWidth: 55 },
      2: { cellWidth: 40 },
      3: { cellWidth: 14, halign: "center" },
      4: { cellWidth: 14, halign: "center" },
      5: { cellWidth: 14, halign: "center", fontStyle: "bold" },
      6: { cellWidth: 18, halign: "center", fontStyle: "bold" },
      7: { cellWidth: 22, halign: "center" },
    },
    // Warnai kolom Tier berdasarkan nilai
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 6) {
        const score = reports[data.row.index]?.priorityScore ?? 0;
        const rgb = tierColor(score);
        data.cell.styles.textColor = rgb;
      }
      if (data.section === "body" && data.column.index === 5) {
        const score = reports[data.row.index]?.priorityScore ?? 0;
        const rgb = tierColor(score);
        data.cell.styles.textColor = rgb;
      }
    },
  });

  // ── Footer setiap halaman ──────────────────────────────────────────────────
  const totalPages = (
    doc.internal as unknown as { getNumberOfPages: () => number }
  ).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...C.border);
    doc.rect(0, H - 10, W, 10, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...C.muted);
    doc.text("StreetWatch — Laporan Prioritas Perbaikan Jalan", MARGIN, H - 4);
    doc.text(`Halaman ${i} / ${totalPages}`, W - MARGIN, H - 4, {
      align: "right",
    });
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`StreetWatch_Prioritas_${dateStr}.pdf`);
}
