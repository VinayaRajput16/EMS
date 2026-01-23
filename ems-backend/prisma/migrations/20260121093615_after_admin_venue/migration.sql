-- CreateEnum
CREATE TYPE "LayoutType" AS ENUM ('ROW_COLUMN', 'OPEN_CROWD', 'ROUND_TABLE');

-- CreateTable
CREATE TABLE "VenueLayoutTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "layoutType" "LayoutType" NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueLayoutTemplate_pkey" PRIMARY KEY ("id")
);
