/*
  Warnings:

  - You are about to drop the column `barCodeType` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `customFontSize` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `groupItemOnPrint` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `groupItemsByPromotions` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `printCustomerAddress` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `qrCodeDescription` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `qrCodeLink` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `refundDays` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `showCustomerBalance` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `showTaxBreakdown` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `useProductNameOnPrint` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "barCodeType",
DROP COLUMN "customFontSize",
DROP COLUMN "groupItemOnPrint",
DROP COLUMN "groupItemsByPromotions",
DROP COLUMN "printCustomerAddress",
DROP COLUMN "qrCodeDescription",
DROP COLUMN "qrCodeLink",
DROP COLUMN "refundDays",
DROP COLUMN "showCustomerBalance",
DROP COLUMN "showTaxBreakdown",
DROP COLUMN "useProductNameOnPrint";

-- CreateTable
CREATE TABLE "CompanyReceipt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "taxNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "refundDays" INTEGER DEFAULT 7,
    "message" TEXT,
    "showTaxBreakdown" BOOLEAN DEFAULT false,
    "sendEmailReceipt" BOOLEAN DEFAULT false,
    "showCustomerBalance" BOOLEAN DEFAULT false,
    "printCustomerAddress" BOOLEAN DEFAULT false,
    "showItemNodes" BOOLEAN DEFAULT false,
    "groupItemsByPromotions" BOOLEAN DEFAULT false,
    "groupItemOnPrint" BOOLEAN DEFAULT false,
    "useProductNameOnPrint" BOOLEAN DEFAULT false,
    "showBarCode" BOOLEAN DEFAULT false,
    "showProductName" BOOLEAN DEFAULT false,
    "showProductDescription" BOOLEAN DEFAULT false,
    "customFontSize" INTEGER DEFAULT 14,
    "barCodeType" TEXT DEFAULT 'CODE128',
    "qrCodeLink" TEXT DEFAULT 'https://example.com/qr-code',
    "qrCodeDescription" TEXT DEFAULT 'Scan this QR code for more information',
    "guid" INTEGER,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyReceipt_companyId_key" ON "CompanyReceipt"("companyId");

-- AddForeignKey
ALTER TABLE "CompanyReceipt" ADD CONSTRAINT "CompanyReceipt_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
