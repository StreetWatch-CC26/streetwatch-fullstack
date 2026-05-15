import { reportRepository } from "@/repositories/report.repository";
import { analyzeImageWithFastAPI } from "@/services/fastapi.service";
import type {
  ReportFilters,
  PaginationOptions,
} from "@/repositories/report.repository";
import type { ReportStatus } from "@/generated/prisma/enums";
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

  async create(authorId: string, data: CreateReportInput) {
    let aiData = {};
    let status: ReportStatus = "fail";

    let finalCategory = data.category;

    try {
      // ⬅️ Kirim imageUrl tunggal ke ML
      const ai = await analyzeImageWithFastAPI(data.imageUrl);

      status = "verified";
      finalCategory =
        (ai.category as CreateReportInput["category"]) || finalCategory;

      aiData = {
        aiScore: ai.score,
        aiLevel: ai.level,
        aiSummary: ai.summary,
        analyzedAt: new Date(),
      };
    } catch (error) {
      console.error("[FastAPI analyze failed]", error);
      status = "fail";
    }

    return reportRepository.create({
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
      status: status,
      ...aiData,
      author: { connect: { id: authorId } },
    });
  },

  async updateStatus(
    id: string,
    status: Parameters<typeof reportRepository.updateStatus>[1],
  ) {
    return reportRepository.updateStatus(id, status);
  },
};
