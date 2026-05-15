import { prisma } from "@/lib/prisma";

export const upvoteRepository = {
  async findOne(userId: string, reportId: string) {
    return prisma.upvote.findUnique({
      where: { userId_reportId: { userId, reportId } },
    });
  },

  async create(userId: string, reportId: string) {
    return prisma.upvote.create({ data: { userId, reportId } });
  },

  async delete(userId: string, reportId: string) {
    return prisma.upvote.delete({
      where: { userId_reportId: { userId, reportId } },
    });
  },

  async findByUser(userId: string) {
    const upvotes = await prisma.upvote.findMany({
      where: { userId },
      select: { reportId: true },
    });
    return upvotes.map((u) => u.reportId);
  },
};
