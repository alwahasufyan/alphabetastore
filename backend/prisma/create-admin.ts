import 'dotenv/config';

import * as bcrypt from 'bcrypt';

import { PrismaClient, Role, UserStatus } from '../src/prisma/prisma-client';

const prisma = new PrismaClient();

type CliArgs = {
  email?: string;
  password?: string;
  name?: string;
};

function parseCliArgs(): CliArgs {
  const args = process.argv.slice(2);
  const parsed: CliArgs = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const nextArg = args[index + 1];

    if ((arg === '--email' || arg === '-e') && nextArg) {
      parsed.email = nextArg.trim().toLowerCase();
      index += 1;
      continue;
    }

    if ((arg === '--password' || arg === '-p') && nextArg) {
      parsed.password = nextArg;
      index += 1;
      continue;
    }

    if ((arg === '--name' || arg === '-n') && nextArg) {
      parsed.name = nextArg.trim();
      index += 1;
    }
  }

  return parsed;
}

async function main() {
  const cliArgs = parseCliArgs();

  const email = (cliArgs.email || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = cliArgs.password || process.env.ADMIN_PASSWORD || '';
  const name = (cliArgs.name || process.env.ADMIN_NAME || 'Alphabeta Admin').trim();
  const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

  if (!email || !password) {
    console.warn('[create-admin] No credentials provided (set ADMIN_EMAIL/ADMIN_PASSWORD or use --email/--password). Skipping.');
    return;
  }

  if (password.length < 8) {
    throw new Error('Admin password must be at least 8 characters.');
  }

  const passwordHash = await bcrypt.hash(password, bcryptSaltRounds);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      name,
      email,
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  console.log('Admin account is ready:', user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
