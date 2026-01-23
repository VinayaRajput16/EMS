/*
  Warnings:

  - You are about to drop the column `config` on the `VenueLayoutTemplate` table. All the data in the column will be lost.
  - Added the required column `schema` to the `VenueLayoutTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "layoutConfig" JSONB,
ADD COLUMN     "layoutTemplateId" TEXT;

-- AlterTable
ALTER TABLE "VenueLayoutTemplate" DROP COLUMN "config",
ADD COLUMN     "schema" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "Venue_layoutTemplateId_idx" ON "Venue"("layoutTemplateId");

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_layoutTemplateId_fkey" FOREIGN KEY ("layoutTemplateId") REFERENCES "VenueLayoutTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
