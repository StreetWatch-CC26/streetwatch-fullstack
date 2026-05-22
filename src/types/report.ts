export interface ReportAuthor {
  id?: string;
  name: string;
  image?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  address: string;
  kecamatan: string;
  kelurahan: string;
  kota: string;
  provinsi: string;
  category: string;
  status: string;
  urgency: string;
  imageUrl: string | null;
  createdAt: string;
  upvoteCount: number;
  author?: ReportAuthor;
  upvotes?: { id: string }[];
}

export interface ReportDetail extends ReportItem {
  aiScore?: number;
  aiLevel?: string;
  aiSummary?: string;
}
