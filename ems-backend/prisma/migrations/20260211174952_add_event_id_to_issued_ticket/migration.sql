/*
  Warnings:

  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_ticketId_fkey";

-- DropIndex
DROP INDEX "Order_ticketId_idx";

-- AlterTable
ALTER TABLE "IssuedTicket" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "quantity",
DROP COLUMN "ticketId";

-- CreateIndex
CREATE INDEX "IssuedTicket_eventId_idx" ON "IssuedTicket"("eventId");

-- CreateIndex
CREATE INDEX "IssuedTicket_orderId_idx" ON "IssuedTicket"("orderId");

-- AddForeignKey
ALTER TABLE "IssuedTicket" ADD CONSTRAINT "IssuedTicket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "IssuedTicket" ADD CONSTRAINT "IssuedTicket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
