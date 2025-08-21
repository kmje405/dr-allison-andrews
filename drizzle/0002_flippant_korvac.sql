ALTER TABLE "contact_submissions" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "archived_at" timestamp;