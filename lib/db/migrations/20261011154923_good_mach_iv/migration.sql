CREATE TYPE "food_order_payment_status" AS ENUM('PENDING', 'PAID');--> statement-breakpoint
CREATE TYPE "payment_attempt_status" AS ENUM('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED');--> statement-breakpoint
CREATE TABLE "food_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"food_order_id" uuid NOT NULL,
	"menu_item_id" integer,
	"item_name" text NOT NULL,
	"unit_price_in_paise" integer NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "food_order_items_quantity_positive" CHECK ("quantity" > 0),
	CONSTRAINT "food_order_items_price_check" CHECK ("unit_price_in_paise" >= 0)
);
--> statement-breakpoint
CREATE TABLE "food_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" integer NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"checkout_request_id" uuid NOT NULL,
	"delivery_address" jsonb NOT NULL,
	"subtotal_in_paise" integer NOT NULL,
	"delivery_fee_in_paise" integer NOT NULL,
	"tax_in_paise" integer NOT NULL,
	"discount_in_paise" integer NOT NULL,
	"amount_in_paise" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"razorpay_order_id" text UNIQUE,
	"payment_status" "food_order_payment_status" DEFAULT 'PENDING'::"food_order_payment_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	CONSTRAINT "food_orders_checkout_request_unique" UNIQUE("customer_id","checkout_request_id"),
	CONSTRAINT "food_orders_amount_positive" CHECK ("amount_in_paise" > 0),
	CONSTRAINT "food_orders_amounts_check" CHECK ("subtotal_in_paise" >= 0
        AND "delivery_fee_in_paise" >= 0
        AND "tax_in_paise" >= 0
        AND "discount_in_paise" >= 0),
	CONSTRAINT "food_orders_total_matches" CHECK ("amount_in_paise" =
        "subtotal_in_paise"
        + "delivery_fee_in_paise"
        + "tax_in_paise"
        - "discount_in_paise")
);
--> statement-breakpoint
CREATE TABLE "payment_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"food_order_id" uuid NOT NULL,
	"razorpay_payment_id" text NOT NULL UNIQUE,
	"payment_status" "payment_attempt_status" NOT NULL,
	"amount_in_paise" integer NOT NULL,
	"currency" text NOT NULL,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_webhook_events" (
	"event_id" text PRIMARY KEY,
	"event_type" text NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "food_order_items_order_idx" ON "food_order_items" ("food_order_id");--> statement-breakpoint
CREATE INDEX "food_orders_customer_idx" ON "food_orders" ("customer_id");--> statement-breakpoint
CREATE INDEX "payment_attempts_order_idx" ON "payment_attempts" ("food_order_id");--> statement-breakpoint
ALTER TABLE "food_order_items" ADD CONSTRAINT "food_order_items_food_order_id_food_orders_id_fkey" FOREIGN KEY ("food_order_id") REFERENCES "food_orders"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "food_order_items" ADD CONSTRAINT "food_order_items_menu_item_id_menu_items_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "food_orders" ADD CONSTRAINT "food_orders_customer_id_profiles_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "profiles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "food_orders" ADD CONSTRAINT "food_orders_restaurant_id_restaurants_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_food_order_id_food_orders_id_fkey" FOREIGN KEY ("food_order_id") REFERENCES "food_orders"("id") ON DELETE RESTRICT;