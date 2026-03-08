import { prisma } from '../client.js';

export const UserRepository = {
  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  async create(data: { username: string; passwordHash: string }) {
    return prisma.user.create({ data });
  },
};
