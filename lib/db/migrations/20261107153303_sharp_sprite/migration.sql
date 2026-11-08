CREATE TYPE "delivery_outcome" AS ENUM('DELIVERED', 'CANCELLED');--> statement-breakpoint
ALTER TABLE "food_orders" ADD COLUMN "delivery_outcome" "delivery_outcome";