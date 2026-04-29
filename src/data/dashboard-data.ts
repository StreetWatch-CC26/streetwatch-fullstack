// ─── Types ────────────────────────────────────────────────────────────────────

export type Urgency = "critical" | "high" | "medium" | "low";
export type ReportStatus = "pending" | "verified" | "in_progress" | "resolved";
export type DamageCategory =
  | "lubang"
  | "retak"
  | "amblas"
  | "longsor"
  | "lainnya";

export interface Report {
  id: string;
  title: string;
  description: string;
  address: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  urgency: Urgency;
  status: ReportStatus;
  category: DamageCategory;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
}

// ─── Label & Color Maps ───────────────────────────────────────────────────────

export const URGENCY_LABEL: Record<Urgency, string> = {
  critical: "Kritis",
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

export const URGENCY_COLOR: Record<Urgency, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export const URGENCY_DOT: Record<Urgency, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "Menunggu",
  verified: "Terverifikasi",
  in_progress: "Dalam Perbaikan",
  resolved: "Selesai",
};

export const STATUS_COLOR: Record<ReportStatus, string> = {
  pending: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-primary/10 text-primary",
  resolved:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export const CATEGORY_LABEL: Record<DamageCategory, string> = {
  lubang: "Lubang",
  retak: "Retak",
  amblas: "Amblas",
  longsor: "Longsor",
  lainnya: "Lainnya",
};

// ─── Mock Reports ─────────────────────────────────────────────────────────────

export const mockReports: Report[] = [
  {
    id: "RPT-001",
    title: "Lubang besar di tengah jalan",
    description:
      "Terdapat lubang berdiameter sekitar 80cm di tengah jalur kanan. Sangat berbahaya di malam hari karena tidak ada penerangan.",
    address: "Jl. Sudirman No. 45",
    district: "Sukajadi",
    city: "Pekanbaru",
    lat: 0.5071,
    lng: 101.4478,
    urgency: "critical",
    status: "in_progress",
    category: "lubang",
    imageUrl: "",
    createdAt: "2025-04-15T08:30:00Z",
    updatedAt: "2025-04-18T14:00:00Z",
    upvotes: 34,
  },
  {
    id: "RPT-002",
    title: "Retak panjang sepanjang 20 meter",
    description:
      "Retakan memanjang di bahu jalan, mulai dari pertigaan hingga depan sekolah.",
    address: "Jl. Ahmad Yani",
    district: "Marpoyan Damai",
    city: "Pekanbaru",
    lat: 0.4898,
    lng: 101.4258,
    urgency: "high",
    status: "verified",
    category: "retak",
    imageUrl: "",
    createdAt: "2025-04-10T10:15:00Z",
    updatedAt: "2025-04-12T09:00:00Z",
    upvotes: 21,
  },
  {
    id: "RPT-003",
    title: "Jalan amblas akibat hujan deras",
    description:
      "Badan jalan turun sekitar 15cm setelah hujan 3 hari berturut-turut.",
    address: "Jl. Riau No. 12",
    district: "Senapelan",
    city: "Pekanbaru",
    lat: 0.5312,
    lng: 101.452,
    urgency: "critical",
    status: "pending",
    category: "amblas",
    imageUrl: "",
    createdAt: "2025-04-20T07:00:00Z",
    updatedAt: "2025-04-20T07:00:00Z",
    upvotes: 47,
  },
  {
    id: "RPT-004",
    title: "Lubang kecil dekat lampu merah",
    description:
      "Lubang kecil berdiameter 20cm di dekat persimpangan lampu merah.",
    address: "Jl. Tuanku Tambusai",
    district: "Payung Sekaki",
    city: "Pekanbaru",
    lat: 0.5124,
    lng: 101.398,
    urgency: "medium",
    status: "resolved",
    category: "lubang",
    imageUrl: "",
    createdAt: "2025-03-28T09:00:00Z",
    updatedAt: "2025-04-05T16:30:00Z",
    upvotes: 8,
  },
  {
    id: "RPT-005",
    title: "Retakan diagonal di jalan protokol",
    description: "Retakan diagonal melewati separuh lebar jalan.",
    address: "Jl. Diponegoro",
    district: "Pekanbaru Kota",
    city: "Pekanbaru",
    lat: 0.519,
    lng: 101.449,
    urgency: "medium",
    status: "verified",
    category: "retak",
    imageUrl: "",
    createdAt: "2025-04-08T11:00:00Z",
    updatedAt: "2025-04-09T10:00:00Z",
    upvotes: 15,
  },
  {
    id: "RPT-006",
    title: "Tepi jalan longsor ke saluran air",
    description:
      "Bahu jalan di pinggir drainase mulai longsor. Lebar jalan berkurang 40cm.",
    address: "Jl. Hang Tuah",
    district: "Tenayan Raya",
    city: "Pekanbaru",
    lat: 0.505,
    lng: 101.478,
    urgency: "high",
    status: "pending",
    category: "longsor",
    imageUrl: "",
    createdAt: "2025-04-18T13:30:00Z",
    updatedAt: "2025-04-18T13:30:00Z",
    upvotes: 29,
  },
  {
    id: "RPT-007",
    title: "Permukaan jalan bergelombang",
    description: "Permukaan aspal bergelombang tidak rata sepanjang 50 meter.",
    address: "Jl. Sisingamangaraja",
    district: "Bukit Raya",
    city: "Pekanbaru",
    lat: 0.478,
    lng: 101.435,
    urgency: "low",
    status: "pending",
    category: "lainnya",
    imageUrl: "",
    createdAt: "2025-04-01T14:00:00Z",
    updatedAt: "2025-04-01T14:00:00Z",
    upvotes: 5,
  },
  {
    id: "RPT-008",
    title: "Lubang dalam di depan pasar",
    description:
      "Lubang sedalam 25cm di depan Pasar Cik Puan. Sering menyebabkan ban bocor.",
    address: "Jl. Nangka",
    district: "Tampan",
    city: "Pekanbaru",
    lat: 0.495,
    lng: 101.41,
    urgency: "high",
    status: "in_progress",
    category: "lubang",
    imageUrl: "",
    createdAt: "2025-04-12T08:00:00Z",
    updatedAt: "2025-04-19T11:00:00Z",
    upvotes: 38,
  },
];

// ─── Mock User ────────────────────────────────────────────────────────────────

export const mockUser = {
  id: "USR-001",
  name: "Budi Santoso",
  email: "budi.santoso@email.com",
  phone: "0812-3456-7890",
  district: "Sukajadi",
  city: "Pekanbaru",
  joinedAt: "2024-11-01T00:00:00Z",
  avatarInitials: "BS",
  totalReports: 12,
  resolvedReports: 7,
  points: 840,
  badges: [
    {
      id: "b1",
      name: "Pelapor Aktif",
      icon: "🏆",
      description: "Membuat 10+ laporan",
      earned: true,
    },
    {
      id: "b2",
      name: "Warga Peduli",
      icon: "🌟",
      description: "5 laporan diselesaikan",
      earned: true,
    },
    {
      id: "b3",
      name: "Penginspirasi",
      icon: "🔥",
      description: "Laporan mendapat 30+ upvote",
      earned: true,
    },
    {
      id: "b4",
      name: "Penjaga Kota",
      icon: "🛡️",
      description: "Membuat 25+ laporan",
      earned: false,
    },
    {
      id: "b5",
      name: "Super Reporter",
      icon: "⚡",
      description: "10 laporan diselesaikan",
      earned: false,
    },
  ],
  myReportIds: ["RPT-001", "RPT-003", "RPT-007"],
};

// ─── Mock Analytics ───────────────────────────────────────────────────────────

export const mockMonthlyTrend = [
  { month: "Nov", total: 8, resolved: 5 },
  { month: "Des", total: 12, resolved: 8 },
  { month: "Jan", total: 15, resolved: 9 },
  { month: "Feb", total: 11, resolved: 7 },
  { month: "Mar", total: 18, resolved: 13 },
  { month: "Apr", total: 14, resolved: 6 },
];

export const mockCategoryBreakdown = [
  { category: "Lubang", count: 42, pct: 42 },
  { category: "Retak", count: 28, pct: 28 },
  { category: "Amblas", count: 15, pct: 15 },
  { category: "Longsor", count: 9, pct: 9 },
  { category: "Lainnya", count: 6, pct: 6 },
];

export const mockDistrictRanking = [
  { district: "Tampan", count: 22, resolved: 14 },
  { district: "Marpoyan Damai", count: 18, resolved: 11 },
  { district: "Tenayan Raya", count: 16, resolved: 8 },
  { district: "Sukajadi", count: 14, resolved: 10 },
  { district: "Payung Sekaki", count: 11, resolved: 7 },
  { district: "Bukit Raya", count: 9, resolved: 6 },
  { district: "Senapelan", count: 8, resolved: 4 },
  { district: "Pekanbaru Kota", count: 2, resolved: 2 },
];
