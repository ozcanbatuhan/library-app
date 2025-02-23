/*
  Warnings:

  - You are about to alter the column `rating` on the `Borrow` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,2)`.

*/
-- AlterTable
ALTER TABLE "Borrow" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(4,2);
