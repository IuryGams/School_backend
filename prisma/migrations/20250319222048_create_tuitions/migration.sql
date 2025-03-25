/*
  Warnings:

  - Changed the type of `dueDate` on the `Tuition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tuition" ADD COLUMN     "paymentDate" "PaymentDates" NOT NULL DEFAULT 'TENTH',
DROP COLUMN "dueDate",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;
