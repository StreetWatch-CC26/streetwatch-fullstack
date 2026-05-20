interface LevelData {
  level: number;
  title: string;
  next: number | null;
}

export interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  points: number;
  hasPassword: boolean;
  createdAt: string;
  level: LevelData;
  _count: { reports: number };
}

export interface StatsData {
  totalReports: number;
  resolvedReports: number;
  points: number;
  pctToNext: number;
  level: LevelData;
}

export interface BadgeData {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt: string | null;
}

export interface ReportItem {
  id: string;
  title: string;
  address: string;
  urgency: "critical" | "high" | "medium" | "low";
  status: "pending" | "verified" | "in_progress" | "resolved";
  upvoteCount: number;
  createdAt: string;
}
