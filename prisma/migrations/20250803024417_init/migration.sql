/*
  Warnings:

  - The values [VIEW,EDIT,DELETE,CREATE,MANAGE] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `Role` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('BACK_OFFICE', 'TILL', 'ADMIN_ACCESS_ON_TILL', 'TILL_SETTINGS', 'QUICK_ADD_SETTINGS', 'CLOCK_IN_CLOCK_OUT_INFO', 'MANAGER_OVERRIDE', 'NO_SALES', 'PETTY_CASH', 'FLOAT_ADJUSTMENT', 'STOCK_SEND', 'STOCK_RECEIVE', 'STOCK_TAKE', 'PAYOUTS', 'HOLD', 'CLOSE_TILL', 'BLIND_END_OF_DAY', 'VOID_ANY_ITEM', 'DELETE_UNORDERED_ITEMS', 'CLEAR_TRANSACTION', 'REMOVE_FROM_TABLE', 'ITEM_DISCOUNT', 'ITEM_DISCOUNT_LIMIT', 'ITEM_DISCOUNT_LIMIT_PERCENTAGE', 'BASKET_DISCOUNT');
ALTER TABLE "Role" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "type";
