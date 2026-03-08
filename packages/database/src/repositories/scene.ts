import { prisma } from '../client.js';
import type { Prisma } from '@prisma/client';

export const SceneRepository = {
  async findByProject(projectId: string) {
    return prisma.scene.findMany({
      where: { projectId },
      orderBy: { orderIndex: 'asc' },
    });
  },
  async findById(id: string) {
    return prisma.scene.findUnique({ where: { id } });
  },
  async createMany(projectId: string, scenes: Array<{ orderIndex: number; type: string; dataJson: Prisma.InputJsonValue }>) {
    return prisma.scene.createMany({
      data: scenes.map((s) => ({ ...s, projectId })),
    });
  },
  async update(id: string, data: { type?: string; orderIndex?: number; dataJson?: Prisma.InputJsonValue }) {
    return prisma.scene.update({ where: { id }, data });
  },
  async deleteByProject(projectId: string) {
    return prisma.scene.deleteMany({ where: { projectId } });
  },
};
