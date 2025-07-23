/*
  Warnings:

  - The primary key for the `Click` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `Click` table. All the data in the column will be lost.
  - The `id` column on the `Click` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Link` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `ipAddress` to the `Click` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `linkId` on the `Click` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `updatedAt` on table `Link` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_linkId_fkey";

-- DropIndex
DROP INDEX "Click_linkId_idx";

-- DropIndex
DROP INDEX "Link_shortCode_idx";

-- AlterTable
ALTER TABLE "Click" DROP CONSTRAINT "Click_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "ip",
ADD COLUMN     "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "linkId",
ADD COLUMN     "linkId" INTEGER NOT NULL,
ADD CONSTRAINT "Click_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Link" DROP CONSTRAINT "Link_pkey",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ADD CONSTRAINT "Link_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
