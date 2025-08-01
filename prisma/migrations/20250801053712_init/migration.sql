/*
  Warnings:

  - The `permissions` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "permissions",
ADD COLUMN     "permissions" "UserPermissionType"[] DEFAULT ARRAY[]::"UserPermissionType"[];
