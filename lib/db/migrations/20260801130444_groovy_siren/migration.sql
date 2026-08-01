CREATE TABLE "email_verification_otps" (
	"profile_id" integer PRIMARY KEY,
	"code_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "email_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "email_verification_otps" ADD CONSTRAINT "email_verification_otps_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;