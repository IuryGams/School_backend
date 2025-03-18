/*
  Warnings:

  - The `dueDate` column on the `Tuition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentDates" AS ENUM ('FIVE', 'TENTH', 'FIFTEENTH', 'TWENTIETH');

-- AlterTable
ALTER TABLE "Tuition" DROP COLUMN "dueDate",
ADD COLUMN     "dueDate" "PaymentDates" NOT NULL DEFAULT 'TENTH';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "username" TEXT;
