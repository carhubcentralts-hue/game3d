import { prisma } from '../client.js';
import type { Prisma } from '@prisma/client';

export const BrandKitRepository = {
  async findByWorkspace(workspaceId: string) {
    return prisma.brandKit.findMany({
      where: { workspaceId },
      include: { logoLight: true, logoDark: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  async findById(id: string) {
    return prisma.brandKit.findUnique({
      where: { id },
      include: { logoLight: true, logoDark: true },
    });
  },
  async create(data: {
    workspaceId: string;
    name: string;
    logoLightAssetId?: string;
    logoDarkAssetId?: string;
    settingsJson?: Prisma.InputJsonValue;
  }) {
    return prisma.brandKit.create({ data });
  },
  async update(id: string, data: Partial<{
    name: string;
    logoLightAssetId: string | null;
    logoDarkAssetId: string | null;
    settingsJson: Prisma.InputJsonValue;
  }>) {
    return prisma.brandKit.update({ where: { id }, data });
  },
};
