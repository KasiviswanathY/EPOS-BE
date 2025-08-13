/*
  Warnings:

  - You are about to drop the column `barCodeId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `BarCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_barCodeId_fkey";

-- DropIndex
DROP INDEX "Product_barCodeId_key";

-- AlterTable
ALTER TABLE "BarCode" ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "barCodeId";

-- AddForeignKey
ALTER TABLE "BarCode" ADD CONSTRAINT "BarCode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
