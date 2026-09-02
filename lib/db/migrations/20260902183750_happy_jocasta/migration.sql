CREATE TYPE "menu_item_availability" AS ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'ALL_DAY');--> statement-breakpoint
CREATE TABLE "pricing_tiers" (
	"id" integer PRIMARY KEY,
	"plan_name" text NOT NULL,
	"plan_price" integer NOT NULL,
	"restaurant_limit" integer NOT NULL,
	"staff_limit" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_subscriptions" (
	"profile_id" integer PRIMARY KEY,
	"pricing_tier_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "menu_items" ALTER COLUMN "timings" SET DATA TYPE "menu_item_availability"[] USING "timings"::text::"menu_item_availability"[];--> statement-breakpoint
ALTER TABLE "profile_subscriptions" ADD CONSTRAINT "profile_subscriptions_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profile_subscriptions" ADD CONSTRAINT "profile_subscriptions_pricing_tier_id_pricing_tiers_id_fkey" FOREIGN KEY ("pricing_tier_id") REFERENCES "pricing_tiers"("id") ON DELETE RESTRICT;--> statement-breakpoint
DROP TYPE "menu_item_timing";