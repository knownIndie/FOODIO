CREATE TABLE "profile_roles" (
	"profile_id" integer,
	"role_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_roles_pkey" PRIMARY KEY("profile_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"role_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role" text NOT NULL UNIQUE
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_id" integer GENERATED ALWAYS AS IDENTITY (sequence name "profiles_profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "profiles" ADD PRIMARY KEY ("profile_id");--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_roles" ADD CONSTRAINT "profile_roles_profile_id_profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profile_roles" ADD CONSTRAINT "profile_roles_role_id_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE;