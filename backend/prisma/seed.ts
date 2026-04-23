import 'dotenv/config';

import * as bcrypt from 'bcrypt';

import { PaymentMethodCode, PrismaClient, Role, UserStatus } from '../src/prisma/prisma-client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? 'Alphabeta Admin';
  const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before running the seed.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, bcryptSaltRounds);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const paymentMethods = [
    {
      code: PaymentMethodCode.COD,
      name: 'Cash on Delivery',
    },
    {
      code: PaymentMethodCode.BANK_TRANSFER,
      name: 'Bank Transfer',
    },
  ];

  for (const paymentMethod of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: {
        code: paymentMethod.code,
      },
      update: {
        name: paymentMethod.name,
        isActive: true,
      },
      create: {
        code: paymentMethod.code,
        name: paymentMethod.name,
        isActive: true,
      },
    });
  }

  const systemSettingsDefaults = [
    { key: 'site_name', value: 'Alphabeta' },
    { key: 'theme', value: 'default' },
    { key: 'primary_color', value: '#1976d2' },
    { key: 'enable_whatsapp', value: 'true' },
  ];

  for (const setting of systemSettingsDefaults) {
    await prisma.systemSetting.upsert({
      where: {
        key: setting.key,
      },
      update: {
        value: setting.value,
      },
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }
}


main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });