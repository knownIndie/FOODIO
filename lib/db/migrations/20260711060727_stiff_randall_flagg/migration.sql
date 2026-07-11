CREATE TYPE "profile_role" AS ENUM('USER', 'RESTAURANT_OWNER');--> statement-breakpoint
ALTER TABLE "profiles" RENAME COLUMN "password" TO "password_hash";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
UPDATE "profiles" SET "role" = 'USER' WHERE "role" IS NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DATA TYPE "profile_role" USING "role"::"profile_role";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DEFAULT 'USER'::"profile_role";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET NOT NULL;
