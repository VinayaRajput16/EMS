/*
  Warnings:

  - You are about to drop the column `venueLayoutTemplateId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `layoutTemplateId` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the `VenueLayoutTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "LayoutType" ADD VALUE 'GALLERY';

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_venueLayoutTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_layoutTemplateId_fkey";

-- DropIndex
DROP INDEX "Venue_layoutTemplateId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "venueLayoutTemplateId";

-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "layoutTemplateId";

-- DropTable
DROP TABLE "VenueLayoutTemplate";
