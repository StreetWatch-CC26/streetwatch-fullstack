// src/services/report.service.ts
import { reportRepository } from "@/repositories/report.repository";
import { analyzeImageWithML, MLNoDamageError } from "@/services/ml.service";
import { gamificationService } from "@/services/gamification.service";
import type {
  ReportFilters,
  PaginationOptions,
} from "@/repositories/report.repository";
import { CreateReportInput } from "@/validations/report.validation";

export const reportService = {
  async getAll(filters: ReportFilters, pagination: PaginationOptions) {
    return reportRepository.findMany(filters, pagination);
  },

  async getForMap(
    filters: Pick<ReportFilters, "provinsi" | "kota">,
    userId?: string,
  ) {
    return reportRepository.findForMap(filters, userId);
  },

  async getById(id: string, userId?: string) {
    const report = await reportRepository.findById(id, userId);
    if (!report) throw new Error("NOT_FOUND");
    return report;
  },

  async create(
    authorId: string,
    data: CreateReportInput,
    signal?: AbortSignal,
  ) {
    const finalCategory = data.category;

    const ai = await analyzeImageWithML(data.imageUrl, signal);

    if (!ai.isDamageDetected) {
      throw new MLNoDamageError();
    }

    const aiData = {
      aiScore: ai.overallConfidence,
      aiLevel: ai.rawSeverity,
      aiSummary: `Terdeteksi ${ai.totalPotholes} titik kerusakan jalan dengan tingkat keparahan ${ai.rawSeverity}.`,
      analyzedAt: new Date(),
    };

    const report = await reportRepository.create({
      title: data.title,
      description: data.description,
      address: data.address,
      kelurahan: data.kelurahan,
      kecamatan: data.kecamatan,
      kota: data.kota,
      provinsi: data.provinsi,
      lat: data.lat,
      lng: data.lng,
      category: finalCategory,
      imageUrl: data.imageUrl,
      status: "verified",
      ...aiData,
      author: { connect: { id: authorId } },
    });

    await gamificationService.awardPoints(authorId, 100).catch((err) => {
      console.error("Gagal memberikan poin:", err);
    });

    return report;
  },

  async updateStatus(
    id: string,
    status: Parameters<typeof reportRepository.updateStatus>[1],
  ) {
    return reportRepository.updateStatus(id, status);
  },
};
