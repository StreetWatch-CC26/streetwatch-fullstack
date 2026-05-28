import { prisma } from "@/lib/prisma";
import type {
  DamageCategory,
  Urgency,
  ReportStatus,
} from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

export interface ReportFilters {
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  urgency?: Urgency;
  status?: ReportStatus;
  category?: DamageCategory;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sort:
    | "createdAt_desc"
    | "createdAt_asc"
    | "upvoteCount_desc"
    | "aiScore_desc";
}

function buildOrderBy(
  sort: PaginationOptions["sort"],
): Prisma.ReportOrderByWithRelationInput {
  switch (sort) {
    case "upvoteCount_desc":
      return { upvoteCount: "desc" };
    case "aiScore_desc":
      return { aiScore: "desc" };
    case "createdAt_asc":
      return { createdAt: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

function buildWhere(filters: ReportFilters): Prisma.ReportWhereInput {
  // Untuk dateTo: set ke akhir hari agar inklusif
  let dateToEnd: Date | undefined;
  if (filters.dateTo) {
    dateToEnd = new Date(filters.dateTo);
    dateToEnd.setHours(23, 59, 59, 999);
  }

  return {
    ...(filters.provinsi && {
      provinsi: { contains: filters.provinsi, mode: "insensitive" },
    }),
    ...(filters.kota && {
      kota: { contains: filters.kota, mode: "insensitive" },
    }),
    ...(filters.kecamatan && {
      kecamatan: { contains: filters.kecamatan, mode: "insensitive" },
    }),
    ...(filters.urgency && { urgency: filters.urgency }),
    ...(filters.status && { status: filters.status }),
    ...(filters.category && { category: filters.category }),
    ...((filters.dateFrom || dateToEnd) && {
      createdAt: {
        ...(filters.dateFrom && { gte: filters.dateFrom }),
        ...(dateToEnd && { lte: dateToEnd }),
      },
    }),
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { kota: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
  };
}

export const reportRepository = {
  async findMany(filters: ReportFilters, pagination: PaginationOptions) {
    const where = buildWhere(filters);
    const currentPage = Math.max(1, pagination.page);
    const skip = (currentPage - 1) * pagination.limit;

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: buildOrderBy(pagination.sort),
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { upvotes: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { data, total };
  },

  async findForMap(
    filters: Pick<ReportFilters, "provinsi" | "kota">,
    userId?: string,
  ) {
    const where: Prisma.ReportWhereInput = {
      ...(filters.provinsi && {
        provinsi: { contains: filters.provinsi, mode: "insensitive" },
      }),
      ...(filters.kota && {
        kota: { contains: filters.kota, mode: "insensitive" },
      }),
    };

    return prisma.report.findMany({
      where,
      select: {
        id: true,
        title: true,
        lat: true,
        lng: true,
        urgency: true,
        status: true,
        category: true,
        upvoteCount: true,
        aiScore: true,
        imageUrl: true,
        description: true,
        address: true,
        kecamatan: true,
        kota: true,
        provinsi: true,
        createdAt: true,
        upvotes: userId ? { where: { userId }, select: { id: true } } : false,
      },
      take: 1000,
    });
  },

  async findById(id: string, userId?: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { upvotes: true } },
        upvotes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });
  },

  async findForExport(filters: ReportFilters, userId?: string) {
    const where = buildWhere(filters);

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where,
        take: 500,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { upvotes: true } },
          upvotes: userId ? { where: { userId }, select: { id: true } } : false,
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { data, total };
  },

  async create(data: Prisma.ReportCreateInput) {
    return prisma.report.create({ data });
  },

  async updateAIResult(
    id: string,
    ai: {
      urgency: Urgency;
      category: DamageCategory;
      aiScore: number;
      aiLevel: string;
      aiSummary: string;
      analyzedAt: Date;
      status: ReportStatus;
    },
  ) {
    return prisma.report.update({ where: { id }, data: ai });
  },

  async updateStatus(id: string, status: ReportStatus) {
    return prisma.report.update({ where: { id }, data: { status } });
  },

  async incrementUpvote(id: string, delta: 1 | -1) {
    return prisma.report.update({
      where: { id },
      data: { upvoteCount: { increment: delta } },
    });
  },

  async markUpvoteRewardClaimed(id: string) {
    return prisma.report.update({
      where: { id },
      data: { isUpvoteRewardClaimed: true },
    });
  },

  async findByAuthor(
    authorId: string,
    pagination: Pick<PaginationOptions, "page" | "limit">,
  ) {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where: { authorId },
        skip,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.report.count({ where: { authorId } }),
    ]);
    return { data, total };
  },
};
