ALTER TABLE "food_orders" ADD COLUMN "delivery_partner_id" integer;--> statement-breakpoint
ALTER TABLE "food_orders" ADD COLUMN "claimed_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "food_orders_delivery_partner_idx" ON "food_orders" ("delivery_partner_id");--> statement-breakpoint
ALTER TABLE "food_orders" ADD CONSTRAINT "food_orders_delivery_partner_id_profiles_id_fkey" FOREIGN KEY ("delivery_partner_id") REFERENCES "profiles"("id") ON DELETE RESTRICT;