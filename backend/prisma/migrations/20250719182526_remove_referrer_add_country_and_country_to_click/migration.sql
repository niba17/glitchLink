/*
  Warnings:

  - You are about to drop the column `referrer` on the `Click` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Click" DROP COLUMN "referrer",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT;
