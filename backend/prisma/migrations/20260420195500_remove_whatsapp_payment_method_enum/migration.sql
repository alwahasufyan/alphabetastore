-- Normalize any legacy unsupported payment values before tightening the enum.
UPDATE "users"
SET "preferred_payment_method" = 'COD'
WHERE "preferred_payment_method"::text = 'WHATSAPP';

UPDATE "orders"
SET "payment_method" = 'COD'
WHERE "payment_method"::text = 'WHATSAPP';

UPDATE "payment_transactions"
SET "payment_method" = 'COD'
WHERE "payment_method"::text = 'WHATSAPP';

UPDATE "payment_transactions" AS pt
SET "payment_method_id" = cod."id"
FROM "payment_methods" AS legacy
JOIN "payment_methods" AS cod ON cod."code"::text = 'COD'
WHERE legacy."code"::text = 'WHATSAPP'
  AND pt."payment_method_id" = legacy."id";

DELETE FROM "payment_methods"
WHERE "code"::text = 'WHATSAPP';

ALTER TYPE "PaymentMethodCode" RENAME TO "PaymentMethodCode_old";

CREATE TYPE "PaymentMethodCode" AS ENUM ('COD', 'BANK_TRANSFER');

ALTER TABLE "users"
ALTER COLUMN "preferred_payment_method" DROP DEFAULT;

ALTER TABLE "payment_methods"
ALTER COLUMN "code" TYPE "PaymentMethodCode"
USING ("code"::text::"PaymentMethodCode");

ALTER TABLE "orders"
ALTER COLUMN "payment_method" TYPE "PaymentMethodCode"
USING (CASE WHEN "payment_method" IS NULL THEN NULL ELSE "payment_method"::text::"PaymentMethodCode" END);

ALTER TABLE "payment_transactions"
ALTER COLUMN "payment_method" TYPE "PaymentMethodCode"
USING ("payment_method"::text::"PaymentMethodCode");

ALTER TABLE "users"
ALTER COLUMN "preferred_payment_method" TYPE "PaymentMethodCode"
USING ("preferred_payment_method"::text::"PaymentMethodCode");

ALTER TABLE "users"
ALTER COLUMN "preferred_payment_method" SET DEFAULT 'COD';

DROP TYPE "PaymentMethodCode_old";