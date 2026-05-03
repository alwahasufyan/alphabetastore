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
    console.warn('[seed] ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin user creation.');
  } else {
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

    console.log(`[seed] Admin user upserted: ${adminEmail}`);
  }

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
    { key: 'site_name', value: 'Alphabeta Store' },
    { key: 'theme', value: 'default' },
    { key: 'primary_color', value: '#1976d2' },
    { key: 'enable_whatsapp', value: 'true' },
    { key: 'default_language', value: 'ar' },
    { key: 'direction', value: 'rtl' },
    { key: 'default_currency', value: 'LYD' },
    { key: 'exchange_rate_usd_to_lyd', value: '5.2' },
    { key: 'shop_phone', value: '+218000000000' },
    { key: 'shop_address', value: 'Tripoli, Libya' },
    { key: 'min_order', value: '0' },
    { key: 'support_email', value: 'support@alphabeta.com' },
    {
      key: 'terms_and_conditions_text',
      value:
        'باستخدامك لمنصة Alphabeta Store وتسجيل حساب جديد، فإنك توافق على صحة البيانات المدخلة والالتزام بسياسات المتجر وإتمام الطلبات بطريقة نظامية.',
    },
    {
      key: 'privacy_policy_text',
      value:
        'تقوم منصة Alphabeta Store بجمع بياناتك الأساسية فقط لغرض تقديم الخدمة ومعالجة الطلبات والدفع والدعم، ولا يتم مشاركة بياناتك خارج نطاق التشغيل القانوني للخدمة.',
    },
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