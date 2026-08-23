DO $$
BEGIN
	CREATE TYPE "menu_cuisine" AS ENUM('NORTH_INDIAN', 'SOUTH_INDIAN', 'CHINESE', 'ITALIAN', 'MEXICAN', 'THAI', 'JAPANESE', 'KOREAN', 'FRENCH', 'OTHER');
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
	CREATE TYPE "menu_item_food_type" AS ENUM('BURGER', 'PIZZA', 'PASTA', 'BIRYANI', 'MOMOS', 'SANDWICH', 'ROLLS', 'SALAD', 'DESSERT', 'DRINKS', 'OTHER');
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
	CREATE TYPE "menu_item_timing" AS ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'ALL_DAY');
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'menu_items'
			AND column_name = 'price'
	) AND NOT EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'menu_items'
			AND column_name = 'price_in_paise'
	) THEN
		ALTER TABLE "menu_items" RENAME COLUMN "price" TO "price_in_paise";
	END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "description" text;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "is_veg" boolean;
--> statement-breakpoint
UPDATE "menu_items" SET "is_veg" = false WHERE "is_veg" IS NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ALTER COLUMN "is_veg" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "is_available" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "food_types" "menu_item_food_type"[];
--> statement-breakpoint
UPDATE "menu_items"
SET "food_types" = ARRAY['OTHER'::"menu_item_food_type"]
WHERE "food_types" IS NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ALTER COLUMN "food_types" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "cuisines" "menu_cuisine"[];
--> statement-breakpoint
UPDATE "menu_items"
SET "cuisines" = ARRAY['OTHER'::"menu_cuisine"]
WHERE "cuisines" IS NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ALTER COLUMN "cuisines" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "timings" "menu_item_timing"[];
--> statement-breakpoint
UPDATE "menu_items"
SET "timings" = ARRAY['ALL_DAY'::"menu_item_timing"]
WHERE "timings" IS NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ALTER COLUMN "timings" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "calories_kcal" integer;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
