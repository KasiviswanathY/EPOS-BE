/*
  Warnings:

  - You are about to drop the column `unit` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barCodeId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Made the column `barCodeId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_barCodeId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "unit",
ALTER COLUMN "barCodeId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_barCodeId_key" ON "Product"("barCodeId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_barCodeId_fkey" FOREIGN KEY ("barCodeId") REFERENCES "BarCode"("barcodeId") ON DELETE RESTRICT ON UPDATE CASCADE;
