CREATE TYPE "compliance_type" AS ENUM('TRADE_LICENSE', 'GST', 'FSSAI');--> statement-breakpoint
CREATE TYPE "restaurant_section_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "menu_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"restaurant_id" integer NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant_bank_accounts" (
	"id" integer GENERATED ALWAYS AS IDENTITY (sequence name "restaurant_bank_accounts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"restaurant_id" integer PRIMARY KEY,
	"account_number" text NOT NULL,
	"bank_name" text NOT NULL,
	"ifsc" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant_business_details" (
	"restaurant_id" integer PRIMARY KEY,
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
	"id" integer GENERATED ALWAYS AS IDENTITY (sequence name "restaurant_compliances_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"restaurant_id" integer PRIMARY KEY,
	"type" "compliance_type" NOT NULL,
	"registration_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant_setup_status" (
	"restaurant_id" integer PRIMARY KEY,
	"restaurant_basic_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL,
	"restaurant_business_details_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL,
	"restaurant_compliances_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL,
	"restaurant_bank_accounts_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL,
	"menu_items_status" "restaurant_section_status" DEFAULT 'NOT_STARTED'::"restaurant_section_status" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "cuisine_types" text;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "resmap_latitude" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "resmap_longitude" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_restaurant_id_restaurants_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_bank_accounts" ADD CONSTRAINT "restaurant_bank_accounts_LEIbsxXiycOs_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_business_details" ADD CONSTRAINT "restaurant_business_details_TaL8Tw2aUViK_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_compliances" ADD CONSTRAINT "restaurant_compliances_4sEFImO6xQuj_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "restaurant_setup_status" ADD CONSTRAINT "restaurant_setup_status_GEWGC3gfinXT_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE CASCADE;