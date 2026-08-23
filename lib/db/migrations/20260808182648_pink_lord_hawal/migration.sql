CREATE TYPE "restaurant_member_role" AS ENUM('OWNER', 'MANAGER', 'STAFF');--> statement-breakpoint
CREATE TYPE "restaurant_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'SUSPENDED');--> statement-breakpoint
CREATE TABLE "restaurant_members" (
	"restaurant_id" integer,
	"profile_id" integer,
	"role" "restaurant_member_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restaurant_members_pkey" PRIMARY KEY("restaurant_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"restaurant_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "restaurants_restaurant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"resmap_latitude" double precision NOT NULL,
	"resmap_longitude" double precision NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"status" "restaurant_status" DEFAULT 'DRAFT'::"restaurant_status" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "restaurant_members" ADD CONSTRAINT "restaurant_members_restaurant_id_restaurants_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_members" ADD CONSTRAINT "restaurant_members_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;