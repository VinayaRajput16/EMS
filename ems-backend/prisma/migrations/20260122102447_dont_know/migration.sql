/*
  Warnings:

  - You are about to drop the column `venueId` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_venueId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "venueId",
ADD COLUMN     "venueLayoutTemplateId" TEXT;

-- AlterTable
ALTER TABLE "SeatCategory" ADD COLUMN     "maxSeats" INTEGER;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venueLayoutTemplateId_fkey" FOREIGN KEY ("venueLayoutTemplateId") REFERENCES "VenueLayoutTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
