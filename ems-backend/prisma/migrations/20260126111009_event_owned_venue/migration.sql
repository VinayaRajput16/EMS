/* ======================================================
   EVENT-OWNED VENUE MIGRATION (SAFE)
   ====================================================== */

-- 1️⃣ Drop foreign keys & indexes that depend on removed columns
ALTER TABLE "IssuedTicket" DROP CONSTRAINT IF EXISTS "IssuedTicket_eventId_fkey";
DROP INDEX IF EXISTS "IssuedTicket_eventId_idx";

ALTER TABLE "Venue" DROP CONSTRAINT IF EXISTS "Venue_organizerId_fkey";
DROP INDEX IF EXISTS "Venue_organizerId_idx";

-- 2️⃣ Add eventId to Venue as NULLABLE first
ALTER TABLE "Venue"
ADD COLUMN "eventId" TEXT;

-- 3️⃣ CREATE ONE EVENT PER EXISTING VENUE (DEV/MVP SAFE)
INSERT INTO "Event" (
  "id",
  "title",
  "startDateTime",
  "endDateTime",
  "organizerId",
  "status",
  "allocationMode",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  'Auto-migrated Event',
  NOW(),
  NOW() + INTERVAL '1 day',
  u."id",
  'DRAFT',
  'MANUAL',
  NOW(),
  NOW()
FROM "Venue" v
JOIN "User" u ON u."id" = (
  SELECT "organizerId"
  FROM "Event"
  LIMIT 1
)
WHERE NOT EXISTS (
  SELECT 1 FROM "Event" e WHERE e."id" = v."eventId"
);

-- 4️⃣ Assign each Venue its OWN Event
UPDATE "Venue" v
SET "eventId" = e."id"
FROM "Event" e
WHERE v."eventId" IS NULL
AND e."title" = 'Auto-migrated Event'
AND e."createdAt" = (
  SELECT MAX("createdAt") FROM "Event"
);


-- 4️⃣ Enforce NOT NULL + UNIQUE (1:1 Event → Venue)
ALTER TABLE "Venue"
ALTER COLUMN "eventId" SET NOT NULL;

CREATE UNIQUE INDEX "Venue_eventId_key"
ON "Venue"("eventId");

-- 5️⃣ Add foreign key Event → Venue
ALTER TABLE "Venue"
ADD CONSTRAINT "Venue_eventId_fkey"
FOREIGN KEY ("eventId")
REFERENCES "Event"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- 6️⃣ Drop obsolete columns (now safe)
ALTER TABLE "IssuedTicket" DROP COLUMN IF EXISTS "eventId";
ALTER TABLE "Seat" DROP COLUMN IF EXISTS "eventId";
ALTER TABLE "Venue" DROP COLUMN IF EXISTS "organizerId";
