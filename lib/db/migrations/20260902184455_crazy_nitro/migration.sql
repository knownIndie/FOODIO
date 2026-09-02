ALTER TABLE "profile_subscriptions" ADD COLUMN "restaurant_limit" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_subscriptions" ALTER COLUMN "staff_limit" SET NOT NULL;