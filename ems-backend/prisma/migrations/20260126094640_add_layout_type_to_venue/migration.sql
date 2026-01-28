-- 1️⃣ Add layoutType WITH DEFAULT so existing rows are safe
ALTER TABLE "Venue"
ADD COLUMN "layoutType" "LayoutType" NOT NULL DEFAULT 'ROW_COLUMN';

-- 2️⃣ Ensure layoutConfig is NOT NULL (set empty object if nulls exist)
UPDATE "Venue"
SET "layoutConfig" = '{}'::jsonb
WHERE "layoutConfig" IS NULL;

ALTER TABLE "Venue"
ALTER COLUMN "layoutConfig" SET NOT NULL;

-- 3️⃣ Ensure capacity is NOT NULL (safety, even if already exists)
ALTER TABLE "Venue"
ALTER COLUMN "capacity" SET NOT NULL;
