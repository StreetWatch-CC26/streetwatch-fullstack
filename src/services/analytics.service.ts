import { prisma } from "@/lib/prisma";

export const analyticsService = {
  /**
   * Mendapatkan ringkasan statistik utama.
   * Menghitung total, jumlah verified, jumlah fail, dan rasio verifikasi.
   */
  async getOverview() {
    const [total, byStatus] = await Promise.all([
      prisma.report.count(),
      prisma.report.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    // Memetakan hasil groupBy ke dalam objek key-value
    const counts = Object.fromEntries(
      byStatus.map((r) => [r.status, r._count._all]),
    );

    const verified = counts.verified ?? 0;
    const fail = counts.fail ?? 0;

    return {
      totalReports: total,
      verifiedReports: verified,
      failReports: fail,
      // Rasio verifikasi: berapa persen laporan yang berhasil dikenali AI
      verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0,
    };
  },

  /**
   * Chart tren pelaporan bulanan.
   * Menampilkan total laporan masuk dan berapa yang berhasil diverifikasi tiap bulan.
   */
  async getMonthlyTrend(months = 12) {
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const reports = await prisma.report.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, status: true },
    });

    // Mengelompokkan data berdasarkan tahun-bulan (YYYY-MM)
    const grouped: Record<string, { total: number; verified: number }> = {};

    for (const r of reports) {
      const key = `${r.createdAt.getFullYear()}-${String(
        r.createdAt.getMonth() + 1,
      ).padStart(2, "0")}`;

      if (!grouped[key]) grouped[key] = { total: 0, verified: 0 };

      grouped[key].total++;
      if (r.status === "verified") {
        grouped[key].verified++;
      }
    }

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => {
        const [year, month] = key.split("-");
        return {
          year: Number(year),
          month: Number(month),
          total: val.total,
          verified: val.verified,
        };
      });
  },

  /**
   * Mendapatkan lokasi dengan intensitas kerusakan tertinggi (berdasarkan jumlah laporan verified).
   */
  async getTopLocations(limit = 10) {
    return prisma.report.groupBy({
      by: ["kota", "provinsi"],
      where: { status: "verified" }, // Hanya hitung lokasi yang terverifikasi rusak
      _count: { _all: true },
      orderBy: { _count: { kota: "desc" } },
      take: limit,
    });
  },

  /**
   * Mendapatkan distribusi kategori kerusakan dari laporan yang terverifikasi.
   */
  async getCategoryBreakdown() {
    const result = await prisma.report.groupBy({
      by: ["category"],
      where: { status: "verified" },
      _count: { _all: true },
    });

    const totalVerified = result.reduce((s, r) => s + r._count._all, 0);

    return result.map((r) => ({
      category: r.category,
      count: r._count._all,
      pct:
        totalVerified > 0
          ? Math.round((r._count._all / totalVerified) * 100)
          : 0,
    }));
  },
};
