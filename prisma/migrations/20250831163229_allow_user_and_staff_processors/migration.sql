/*
  Warnings:

  - You are about to drop the column `processedById` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `processedById` on the `StockMovement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_processedById_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_processedById_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "processedById",
ADD COLUMN     "processedByStaffId" TEXT,
ADD COLUMN     "processedByUserId" TEXT;

-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "processedById",
ADD COLUMN     "processedByStaffId" TEXT,
ADD COLUMN     "processedByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_processedByStaffId_fkey" FOREIGN KEY ("processedByStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_processedByUserId_fkey" FOREIGN KEY ("processedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_processedByStaffId_fkey" FOREIGN KEY ("processedByStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_processedByUserId_fkey" FOREIGN KEY ("processedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
