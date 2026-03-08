import { prisma } from '../client.js';

export const ToolRepository = {
  async findByKey(key: string) {
    return prisma.tool.findUnique({ where: { key } });
  },
  async findAll() {
    return prisma.tool.findMany({ orderBy: { createdAt: 'asc' } });
  },
  async findEnabled() {
    return prisma.tool.findMany({ where: { isEnabled: true }, orderBy: { createdAt: 'asc' } });
  },
  async create(data: { key: string; name: string; description?: string; icon?: string }) {
    return prisma.tool.create({ data });
  },
};
