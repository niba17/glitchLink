/*
  Warnings:

  - A unique constraint covering the columns `[customAlias]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Link` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userId_fkey";

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "clicksCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "customAlias" TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Click_linkId_idx" ON "Click"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_customAlias_key" ON "Link"("customAlias");

-- CreateIndex
CREATE INDEX "Link_shortCode_idx" ON "Link"("shortCode");

-- CreateIndex
CREATE INDEX "Link_userId_idx" ON "Link"("userId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
