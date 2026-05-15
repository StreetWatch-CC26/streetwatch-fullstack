// src/repositories/user.repository.ts

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        points: true,
        password: true,
        createdAt: true,
        _count: { select: { reports: true } },
      },
    });
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });
  },

  async getStats(id: string) {
    const [total, resolved] = await Promise.all([
      prisma.report.count({ where: { authorId: id } }),
      prisma.report.count({ where: { authorId: id, status: "verified" } }),
    ]);
    return { totalReports: total, resolvedReports: resolved };
  },

  async getBadges(id: string) {
    const [allBadges, userBadges] = await Promise.all([
      prisma.badge.findMany({ orderBy: { minPoints: "asc" } }),
      prisma.userBadge.findMany({
        where: { userId: id },
        select: { badgeId: true, earnedAt: true },
      }),
    ]);
    const earnedIds = new Set(userBadges.map((b) => b.badgeId));
    return allBadges.map((badge) => ({
      ...badge,
      earned: earnedIds.has(badge.id),
      earnedAt:
        userBadges.find((b) => b.badgeId === badge.id)?.earnedAt ?? null,
    }));
  },

  async getReports(id: string) {
    return prisma.report.findMany({
      where: { authorId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        address: true,
        urgency: true,
        status: true,
        upvoteCount: true,
        createdAt: true,
      },
    });
  },
};
