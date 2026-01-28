/*
  Warnings:

  - You are about to drop the column `availableQuantity` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuantity` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "availableQuantity",
DROP COLUMN "totalQuantity";
