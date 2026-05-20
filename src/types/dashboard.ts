import {
  DamageCategory,
  ReportStatus,
  Urgency,
} from "@/generated/prisma/enums";

export interface AnalyticsOverview {
  totalReports: number;
  verifiedReports: number;
  failReports: number;
  verificationRate: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  total: number;
  verified: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  pct: number;
}

export interface DistrictRanking {
  kota: string;
  provinsi?: string;
  _count: {
    _all: number;
  };
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  address: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  lat: number;
  lng: number;
  urgency: Urgency;
  status: ReportStatus;
  category: DamageCategory;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
}
