/*
  Warnings:

  - The values [TWENTIETH] on the enum `PaymentDates` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paid` on the `Tuition` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'CANCELED', 'REFUNDED');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentDates_new" AS ENUM ('FIVE', 'TENTH', 'FIFTEENTH');
ALTER TABLE "Tuition" ALTER COLUMN "paymentDate" DROP DEFAULT;
ALTER TABLE "Tuition" ALTER COLUMN "paymentDate" TYPE "PaymentDates_new" USING ("paymentDate"::text::"PaymentDates_new");
ALTER TYPE "PaymentDates" RENAME TO "PaymentDates_old";
ALTER TYPE "PaymentDates_new" RENAME TO "PaymentDates";
DROP TYPE "PaymentDates_old";
ALTER TABLE "Tuition" ALTER COLUMN "paymentDate" SET DEFAULT 'TENTH';
COMMIT;

-- AlterTable
ALTER TABLE "Tuition" DROP COLUMN "paid",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
