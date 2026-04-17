import 'dotenv/config';

import * as bcrypt from 'bcrypt';

import { PrismaClient, Role, UserStatus } from '../src/prisma/prisma-client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? 'Alphabeta Admin';
  const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before running the seed.');
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, bcryptSaltRounds);

  await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });