import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create default user
  const user = await prisma.user.upsert({
    where: { username: 'Prosaas' },
    update: {},
    create: {
      username: 'Prosaas',
      passwordHash: hashPassword(process.env.DEFAULT_USER_PASSWORD || 'Sd@090702'),
    },
  });
  console.log('✅ User created:', user.username);

  // Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'ProSaaS',
      slug: 'default',
    },
  });
  console.log('✅ Workspace created:', workspace.name);

  // Create Video Studio tool
  const tool = await prisma.tool.upsert({
    where: { key: 'video-studio' },
    update: {},
    create: {
      key: 'video-studio',
      name: 'Video Studio',
      description: 'Create professional marketing videos with AI-powered scene generation and Remotion rendering',
      icon: 'video',
      isEnabled: true,
    },
  });
  console.log('✅ Tool created:', tool.name);

  console.log('🌱 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
