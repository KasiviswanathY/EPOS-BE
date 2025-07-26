/*
  Warnings:

  - You are about to drop the column `description` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Company` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Company_email_key";

-- DropIndex
DROP INDEX "Company_website_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "description",
DROP COLUMN "displayName",
DROP COLUMN "email",
DROP COLUMN "website",
ADD COLUMN     "eraseCustomerData" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "explicitConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxNoOfDevices" INTEGER DEFAULT 1,
ADD COLUMN     "maxNoOfLocations" INTEGER DEFAULT 1,
ADD COLUMN     "runReportsOnPageLoad" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showIncExTaxOption" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showInstructionsOnStartup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updateCostPriceOnMasterUpdate" BOOLEAN NOT NULL DEFAULT false;
