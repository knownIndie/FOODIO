DROP TABLE IF EXISTS "menu_items";--> statement-breakpoint
DROP TABLE IF EXISTS "restaurant_bank_accounts";--> statement-breakpoint
DROP TABLE IF EXISTS "restaurant_compliances";--> statement-breakpoint
DROP TABLE IF EXISTS "restaurant_business_details";--> statement-breakpoint
DROP TABLE IF EXISTS "restaurant_members";--> statement-breakpoint
DROP TABLE IF EXISTS "restaurant_setup_status";--> statement-breakpoint
DROP TABLE IF EXISTS "restaurants";--> statement-breakpoint

CREATE TABLE "restaurants" (
	"restaurant_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"resmap_latitude" double precision,
	"resmap_longitude" double precision,
	"cuisine_types" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"status" "restaurant_status" DEFAULT 'DRAFT' NOT NULL
);--> statement-breakpoint

CREATE TABLE "restaurant_business_details" (
	"restaurant_id" uuid PRIMARY KEY NOT NULL,
	"legal_name" text NOT NULL,
	"entity_type" text NOT NULL,
	"registered_address" text NOT NULL,
	"owner_or_poc_name" text NOT NULL,
	"owner_or_poc_phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restaurant_business_details_restaurant_id_restaurants_restaurant_id_fk"
		FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id")
		ON DELETE cascade
);--> statement-breakpoint

CREATE TABLE "restaurant_compliances" (
	"id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"type" "compliance_type" NOT NULL,
	"registration_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restaurant_compliance_type_unique" UNIQUE("restaurant_id", "type"),
	CONSTRAINT "restaurant_compliances_restaurant_id_restaurants_restaurant_id_fk"
		FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id")
		ON DELETE cascade
);--> statement-breakpoint

CREATE TABLE "restaurant_bank_accounts" (
	"restaurant_id" uuid PRIMARY KEY NOT NULL,
	"account_number" text NOT NULL,
	"bank_name" text NOT NULL,
	"ifsc" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restaurant_bank_accounts_restaurant_id_restaurants_restaurant_id_fk"
		FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id")
		ON DELETE cascade
);--> statement-breakpoint

CREATE TABLE "restaurant_setup_status" (
	"restaurant_id" uuid PRIMARY KEY NOT NULL,
	"restaurant_basic_status" "restaurant_section_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"restaurant_business_details_status" "restaurant_section_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"restaurant_compliances_status" "restaurant_section_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"restaurant_bank_accounts_status" "restaurant_section_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"menu_items_status" "restaurant_section_status" DEFAULT 'NOT_STARTED' NOT NULL,
	CONSTRAINT "restaurant_setup_status_restaurant_id_restaurants_restaurant_id_fk"
		FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id")
		ON DELETE cascade
);--> statement-breakpoint

CREATE TABLE "restaurant_members" (
	"restaurant_id" uuid NOT NULL,
	"profile_id" integer NOT NULL,
	"role" "restaurant_member_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restaurant_members_restaurant_id_profile_id_pk"
		PRIMARY KEY("restaurant_id", "profile_id"),
	CONSTRAINT "restaurant_members_restaurant_id_restaurants_restaurant_id_fk"
		FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id")
		ON DELETE cascade,
	CONSTRAINT "restaurant_members_profile_id_profiles_id_fk"
		FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id")
		ON DELETE cascade
);--> statement-breakpoint

CREATE TABLE "menu_items" (
	"id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	CONSTRAINT "menu_items_restaurant_id_restaurants_restaurant_id_fk"
		FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id")
		ON DELETE cascade
);
