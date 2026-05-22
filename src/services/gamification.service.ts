// src/services/gamification.service.ts
import { prisma } from "@/lib/prisma";

/**
 * Menambahkan poin ke user dan mengecek ketersediaan badge baru.
 */
export const gamificationService = {
  async awardPoints(userId: string, pointsToAdd: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } },
      include: {
        _count: { select: { reports: true } },
        badges: { select: { badgeId: true } },
      },
    });

    const currentPoints = user.points;
    const totalReports = user._count.reports;
    const ownedBadgeIds = user.badges.map((b) => b.badgeId);

    const availableBadges = await prisma.badge.findMany({
      where: {
        id: { notIn: ownedBadgeIds },
      },
    });

    const badgesToAward = availableBadges.filter((badge) => {
      const meetPoints =
        badge.minPoints > 0 ? currentPoints >= badge.minPoints : true;
      const meetReports =
        badge.minReports > 0 ? totalReports >= badge.minReports : true;

      return meetPoints && meetReports;
    });

    if (badgesToAward.length > 0) {
      await prisma.userBadge.createMany({
        data: badgesToAward.map((badge) => ({
          userId: user.id,
          badgeId: badge.id,
        })),
        skipDuplicates: true,
      });
    }

    return { updatedPoints: currentPoints, newBadges: badgesToAward };
  },
};
