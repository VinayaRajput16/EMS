/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `SeatCategory` table. All the data in the column will be lost.
  - Added the required column `venueId` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueId` to the `SeatCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_eventId_fkey";

-- DropForeignKey
ALTER TABLE "SeatCategory" DROP CONSTRAINT "SeatCategory_eventId_fkey";

-- DropIndex
DROP INDEX "Seat_categoryId_idx";

-- DropIndex
DROP INDEX "Seat_eventId_idx";

-- DropIndex
DROP INDEX "Seat_eventId_label_key";

-- DropIndex
DROP INDEX "Seat_status_idx";

-- DropIndex
DROP INDEX "SeatCategory_eventId_idx";

-- DropIndex
DROP INDEX "SeatCategory_eventId_priority_idx";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "venueId" TEXT NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SeatCategory" DROP COLUMN "eventId",
ADD COLUMN     "venueId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SeatCategory_venueId_idx" ON "SeatCategory"("venueId");

-- CreateIndex
CREATE INDEX "SeatCategory_venueId_priority_idx" ON "SeatCategory"("venueId", "priority");

-- AddForeignKey
ALTER TABLE "SeatCategory" ADD CONSTRAINT "SeatCategory_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
