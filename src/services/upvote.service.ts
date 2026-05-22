// src/services/upvote.service.ts
import { upvoteRepository } from "@/repositories/upvote.repository";
import { reportRepository } from "@/repositories/report.repository";
import { gamificationService } from "@/services/gamification.service";

export const upvoteService = {
  async toggle(userId: string, reportId: string) {
    const existing = await upvoteRepository.findOne(userId, reportId);

    if (existing) {
      // BATAL UPVOTE (UNLIKE)
      await upvoteRepository.delete(userId, reportId);
      const updated = await reportRepository.incrementUpvote(reportId, -1);
      return { upvoted: false, upvoteCount: updated.upvoteCount };
    } else {
      // TAMBAH UPVOTE
      await upvoteRepository.create(userId, reportId);
      const updated = await reportRepository.incrementUpvote(reportId, 1);

      // 🌟 LOGIKA ANTI-FARMING POIN 🌟
      // Gunakan >= 20 untuk berjaga-jaga, dan pastikan flag-nya masih false
      if (updated.upvoteCount >= 20 && !updated.isUpvoteRewardClaimed) {
        await reportRepository.markUpvoteRewardClaimed(reportId);

        gamificationService.awardPoints(updated.authorId, 100).catch((err) => {
          console.error(
            `[Gamification Error] Gagal memberikan 100 poin upvote:`,
            err,
          );
        });
      }

      return { upvoted: true, upvoteCount: updated.upvoteCount };
    }
  },

  async getUserUpvoted(userId: string) {
    return upvoteRepository.findByUser(userId);
  },
};
