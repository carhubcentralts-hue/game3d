import { prisma } from '../client.js';
import type { Prisma } from '@prisma/client';

export const AssetRepository = {
  async findById(id: string) {
    return prisma.asset.findUnique({ where: { id } });
  },
  async findByWorkspace(workspaceId: string, options?: { type?: string; limit?: number }) {
    return prisma.asset.findMany({
      where: { workspaceId, ...(options?.type ? { type: options.type } : {}) },
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
    });
  },
  async create(data: {
    workspaceId: string;
    type: string;
    filename: string;
    mimeType: string;
    storageKey: string;
    publicUrl?: string;
    metadataJson?: Prisma.InputJsonValue;
  }) {
    return prisma.asset.create({ data });
  },
  async delete(id: string) {
    return prisma.asset.delete({ where: { id } });
  },
};
