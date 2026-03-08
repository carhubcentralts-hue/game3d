import { prisma } from '../client.js';
import type { Prisma } from '@prisma/client';

export const RenderJobRepository = {
  async findById(id: string) {
    return prisma.renderJob.findUnique({
      where: { id },
      include: { project: true, outputs: { include: { asset: true } } },
    });
  },
  async findByProject(projectId: string) {
    return prisma.renderJob.findMany({
      where: { projectId },
      include: { outputs: { include: { asset: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },
  async findRecent(limit = 10) {
    return prisma.renderJob.findMany({
      include: { project: true, outputs: { include: { asset: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
  async create(projectId: string) {
    return prisma.renderJob.create({
      data: { projectId, status: 'pending' },
      include: { project: true },
    });
  },
  async updateStatus(id: string, data: {
    status: string;
    progress?: number;
    logsJson?: Prisma.InputJsonValue;
    startedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
  }) {
    return prisma.renderJob.update({ where: { id }, data });
  },
  async createOutput(data: {
    renderJobId: string;
    assetId: string;
    format: string;
    width: number;
    height: number;
    fps: number;
    duration: number;
  }) {
    return prisma.renderOutput.create({ data });
  },
};
