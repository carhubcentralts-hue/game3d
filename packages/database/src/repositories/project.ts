import { prisma } from '../client.js';
import type { Prisma } from '@prisma/client';

export const ProjectRepository = {
  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: { scenes: { orderBy: { orderIndex: 'asc' } }, tool: true },
    });
  },
  async findByWorkspace(workspaceId: string, options?: { toolKey?: string; limit?: number }) {
    return prisma.project.findMany({
      where: {
        workspaceId,
        ...(options?.toolKey ? { tool: { key: options.toolKey } } : {}),
      },
      include: { tool: true, scenes: { orderBy: { orderIndex: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
      take: options?.limit,
    });
  },
  async create(data: {
    toolId: string;
    workspaceId: string;
    title: string;
    slug: string;
    description?: string;
    metaJson?: Prisma.InputJsonValue;
    settingsJson?: Prisma.InputJsonValue;
  }) {
    return prisma.project.create({ data, include: { tool: true } });
  },
  async update(id: string, data: Partial<{
    title: string;
    description: string;
    status: string;
    metaJson: Prisma.InputJsonValue;
    settingsJson: Prisma.InputJsonValue;
  }>) {
    return prisma.project.update({ where: { id }, data, include: { tool: true, scenes: { orderBy: { orderIndex: 'asc' } } } });
  },
  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },
};
