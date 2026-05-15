// src/services/user.service.ts

import { userRepository } from "@/repositories/user.repository";

function computeLevel(points: number) {
  if (points >= 1000) return { level: 5, title: "Legenda Kota", next: null };
  if (points >= 750) return { level: 4, title: "Pejuang Jalan", next: 1000 };
  if (points >= 500) return { level: 3, title: "Aktivis Lokal", next: 750 };
  if (points >= 250) return { level: 2, title: "Warga Peduli", next: 500 };
  return { level: 1, title: "Pelapor Baru", next: 250 };
}

export const userService = {
  async getProfile(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("NOT_FOUND");

    const { password, ...rest } = user;
    const levelData = computeLevel(user.points);

    return {
      ...rest,
      hasPassword: !!password,
      level: levelData,
    };
  },

  async updateProfile(id: string, data: { name?: string; image?: string }) {
    return userRepository.update(id, data);
  },

  async getStats(id: string) {
    const { totalReports, resolvedReports } = await userRepository.getStats(id);
    const user = await userRepository.findById(id);
    const levelData = computeLevel(user?.points ?? 0);

    const pctToNext = levelData.next
      ? Math.round((((user?.points ?? 0) - (levelData.next - 250)) / 250) * 100)
      : 100;

    return {
      totalReports,
      resolvedReports,
      points: user?.points ?? 0,
      level: levelData,
      pctToNext,
    };
  },

  async getBadges(id: string) {
    return userRepository.getBadges(id);
  },

  async getReports(id: string) {
    return userRepository.getReports(id);
  },
};
