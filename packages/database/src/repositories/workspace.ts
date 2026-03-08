import { prisma } from '../client.js';

export const WorkspaceRepository = {
  async findBySlug(slug: string) {
    return prisma.workspace.findUnique({ where: { slug } });
  },
  async findById(id: string) {
    return prisma.workspace.findUnique({ where: { id } });
  },
  async getDefault() {
    return prisma.workspace.findFirst({ orderBy: { createdAt: 'asc' } });
  },
  async create(data: { name: string; slug: string }) {
    return prisma.workspace.create({ data });
  },
};
