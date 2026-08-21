CREATE TYPE "compliance_type" AS ENUM('TRADE_LICENSE', 'GST', 'FSSAI');--> statement-breakpoint
CREATE TYPE "menu_cuisine" AS ENUM('NORTH_INDIAN', 'SOUTH_INDIAN', 'CHINESE', 'ITALIAN', 'MEXICAN', 'THAI', 'JAPANESE', 'KOREAN', 'FRENCH', 'OTHER');--> statement-breakpoint
CREATE TYPE "menu_item_food_type" AS ENUM('BURGER', 'PIZZA', 'PASTA', 'BIRYANI', 'MOMOS', 'SANDWICH', 'ROLLS', 'SALAD', 'DESSERT', 'DRINKS', 'OTHER');--> statement-breakpoint
CREATE TYPE "menu_item_timing" AS ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'ALL_DAY');--> statement-breakpoint
CREATE TYPE "restaurant_member_role" AS ENUM('OWNER', 'MANAGER', 'STAFF');--> statement-breakpoint
CREATE TYPE "restaurant_section_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "restaurant_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'SUSPENDED');--> statement-breakpoint
CREATE TABLE "email_verification_otps" (
	"profile_id" integer PRIMARY KEY,
	"code_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "menu_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"restaurant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price_in_paise" integer NOT NULL,
	"is_veg" boolean NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"food_types" "menu_item_food_type"[] NOT NULL,
	"cuisines" "menu_cuisine"[] NOT NULL,
	"timings" "menu_item_timing"[] NOT NULL,
	"calories_kcal" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_roles" (
	"profile_id" integer,
	"role_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_roles_pkey" PRIMARY KEY("profile_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant_bank_accounts" (
	"restaurant_id" uuid PRIMARY KEY,
	"account_number" text NOT NULL,
	"bank_name" text NOT NULL,
	"ifsc" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant_business_details" (
	"restaurant_id" uuid PRIMARY KEY,
	"legal_name" text NOT NULL,
	"entity_type" text NOT NULL,
	"registered_address" text NOT NULL,
	"owner_or_poc_name" text NOT NULL,
	"owner_or_poc_phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant_compliances" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "restaurant_compliances_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"restaurant_id" uuid NOT NULL,
	"type" "compliance_type" NOT NULL,
	"registration_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restaurant_compliance_type_unique" UNIQUE("restaurant_id","type")
);
--> statement-breakpoint
CREATE TABLE "restaurant_members" (
	"restaurant_id" uuid,
	"profile_id" integer,
	"role" "restaurant_member_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restaurant_members_pkey" PRIMARY KEY("restaurant_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "restaurant_setup_status" (
	"restaurant_id" uuid PRIMARY KEY,
	"restaurant_basic_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL,
	"restaurant_business_details_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL,
	"restaurant_compliances_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL,
	"restaurant_bank_accounts_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL,
	"menu_items_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"restaurant_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
	"status" "restaurant_status" DEFAULT 'DRAFT'::"restaurant_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"role_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role" text NOT NULL UNIQUE
);
--> statement-breakpoint
ALTER TABLE "email_verification_otps" ADD CONSTRAINT "email_verification_otps_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_restaurant_id_restaurants_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profile_roles" ADD CONSTRAINT "profile_roles_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profile_roles" ADD CONSTRAINT "profile_roles_role_id_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_bank_accounts" ADD CONSTRAINT "restaurant_bank_accounts_LEIbsxXiycOs_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_business_details" ADD CONSTRAINT "restaurant_business_details_TaL8Tw2aUViK_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_compliances" ADD CONSTRAINT "restaurant_compliances_4sEFImO6xQuj_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_members" ADD CONSTRAINT "restaurant_members_restaurant_id_restaurants_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_members" ADD CONSTRAINT "restaurant_members_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_setup_status" ADD CONSTRAINT "restaurant_setup_status_GEWGC3gfinXT_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;