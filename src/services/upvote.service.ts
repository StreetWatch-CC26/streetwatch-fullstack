import { upvoteRepository } from "@/repositories/upvote.repository";
import { reportRepository } from "@/repositories/report.repository";

export const upvoteService = {
  /**
   * Toggle upvote — idempotent.
   * Jika sudah upvote: hapus (un-upvote).
   * Jika belum: tambah.
   * Selalu update upvoteCount di report secara atomik.
   */
  async toggle(userId: string, reportId: string) {
    const existing = await upvoteRepository.findOne(userId, reportId);

    if (existing) {
      await upvoteRepository.delete(userId, reportId);
      const updated = await reportRepository.incrementUpvote(reportId, -1);
      return { upvoted: false, upvoteCount: updated.upvoteCount };
    } else {
      await upvoteRepository.create(userId, reportId);
      const updated = await reportRepository.incrementUpvote(reportId, 1);
      return { upvoted: true, upvoteCount: updated.upvoteCount };
    }
  },

  async getUserUpvoted(userId: string) {
    return upvoteRepository.findByUser(userId);
  },
};
