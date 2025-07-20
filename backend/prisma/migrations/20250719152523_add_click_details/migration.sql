/*
  Warnings:

  - You are about to drop the column `city` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Click` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Click" DROP COLUMN "city",
DROP COLUMN "country",
ADD COLUMN     "referrer" TEXT;
