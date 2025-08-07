/*
  Warnings:

  - You are about to drop the column `productId` on the `BarCode` table. All the data in the column will be lost.
  - You are about to drop the column `discountId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `discountId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productOrderCode]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[articleCode]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nominalCode]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[posOrder]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "WetOrDry" AS ENUM ('WET', 'DRY');

-- CreateEnum
CREATE TYPE "UnitOfSale" AS ENUM ('cards', 'each', 'kg', 'litre', 'packet', 'cl', 'cm', 'cup', 'ft', 'g', 'gal', 'halfPint', 'in', 'l', 'lb', 'ml', 'm', 'oz');

-- CreateEnum
CREATE TYPE "PromotionDuration" AS ENUM ('BETWEEN_DATES', 'BETWEEN_TIMES');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('X_FOR_Y', 'X_FOR_DOLLAR', 'PERCENTAGE_DISCOUNT', 'SPEND_DOLLAR_SAVE_PERCENTAGE', 'SPEND_DOLLAR_SAVE_DOLLAR');

-- CreateEnum
CREATE TYPE "DAYS_OF_WEEK" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- DropForeignKey
ALTER TABLE "BarCode" DROP CONSTRAINT "BarCode_productId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_discountId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_discountId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_productId_fkey";

-- DropIndex
DROP INDEX "BarCode_productId_key";

-- AlterTable
ALTER TABLE "BarCode" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "articleCode" TEXT,
ADD COLUMN     "productOrderCode" TEXT;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "discountId",
ADD COLUMN     "nominalCode" TEXT,
ADD COLUMN     "popupNoteId" TEXT,
ADD COLUMN     "reportCategory" TEXT,
ADD COLUMN     "showonTill" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "wetOrDry" "WetOrDry" NOT NULL DEFAULT 'WET';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discountId",
ADD COLUMN     "barCodeId" TEXT,
ADD COLUMN     "brandId" TEXT,
ADD COLUMN     "buttonColor" TEXT DEFAULT 'blue',
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "containerFeeId" TEXT,
ADD COLUMN     "mulitChoiceProductGroupId" TEXT,
ADD COLUMN     "orderQuantityLimit" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "posOrder" TEXT,
ADD COLUMN     "productTagId" TEXT,
ADD COLUMN     "rrp" DOUBLE PRECISION,
ADD COLUMN     "scannableOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellOnPos" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sellOnTill" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "taxExempt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taxRateId" TEXT,
ADD COLUMN     "unitOfSale" "UnitOfSale" DEFAULT 'each',
ADD COLUMN     "variablePrice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "volumeOfSale" DOUBLE PRECISION DEFAULT 1.0;

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "productId";

-- DropTable
DROP TABLE "Discount";

-- CreateTable
CREATE TABLE "PopupNote" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "showOncePerTransaction" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PopupNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" "PromotionDuration" NOT NULL DEFAULT 'BETWEEN_DATES',
    "fromDate" TIMESTAMP(3),
    "toDate" TIMESTAMP(3),
    "timeFrom" TIMESTAMP(3),
    "timeTo" TIMESTAMP(3),
    "mealDeal" BOOLEAN NOT NULL DEFAULT false,
    "noOfMealDealGroups" INTEGER DEFAULT 1,
    "type" "PromotionType" NOT NULL,
    "requiredQuantity" DOUBLE PRECISION DEFAULT 1.0,
    "discountAmount" DOUBLE PRECISION DEFAULT 0.0,
    "mixAndMatch" BOOLEAN NOT NULL DEFAULT false,
    "usedWithOtherPromotions" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "daysEnabled" "DAYS_OF_WEEK"[] DEFAULT ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']::"DAYS_OF_WEEK"[],
    "customerTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContainerFee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fee" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContainerFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MulitChoiceProductGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MulitChoiceProductGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToPromotions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToPromotions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductToPromotions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToPromotions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTag_name_key" ON "ProductTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TaxRate_name_key" ON "TaxRate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContainerFee_name_key" ON "ContainerFee"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MulitChoiceProductGroup_name_key" ON "MulitChoiceProductGroup"("name");

-- CreateIndex
CREATE INDEX "_CategoryToPromotions_B_index" ON "_CategoryToPromotions"("B");

-- CreateIndex
CREATE INDEX "_ProductToPromotions_B_index" ON "_ProductToPromotions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_productOrderCode_key" ON "Brand"("productOrderCode");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_articleCode_key" ON "Brand"("articleCode");

-- CreateIndex
CREATE UNIQUE INDEX "Category_nominalCode_key" ON "Category"("nominalCode");

-- CreateIndex
CREATE UNIQUE INDEX "Product_posOrder_key" ON "Product"("posOrder");

-- AddForeignKey
ALTER TABLE "Promotions" ADD CONSTRAINT "Promotions_customerTypeId_fkey" FOREIGN KEY ("customerTypeId") REFERENCES "CustomerType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_popupNoteId_fkey" FOREIGN KEY ("popupNoteId") REFERENCES "PopupNote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_taxRateId_fkey" FOREIGN KEY ("taxRateId") REFERENCES "TaxRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_barCodeId_fkey" FOREIGN KEY ("barCodeId") REFERENCES "BarCode"("barcodeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTagId_fkey" FOREIGN KEY ("productTagId") REFERENCES "ProductTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_containerFeeId_fkey" FOREIGN KEY ("containerFeeId") REFERENCES "ContainerFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_mulitChoiceProductGroupId_fkey" FOREIGN KEY ("mulitChoiceProductGroupId") REFERENCES "MulitChoiceProductGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPromotions" ADD CONSTRAINT "_CategoryToPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPromotions" ADD CONSTRAINT "_CategoryToPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToPromotions" ADD CONSTRAINT "_ProductToPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToPromotions" ADD CONSTRAINT "_ProductToPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
