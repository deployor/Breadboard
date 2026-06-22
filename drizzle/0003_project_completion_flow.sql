ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'materials_review';--> statement-breakpoint
ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'kit_approved';--> statement-breakpoint
ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'kit_fulfillment';--> statement-breakpoint
ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'kit_sent';--> statement-breakpoint
ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'building';--> statement-breakpoint
ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'demo_review';--> statement-breakpoint
ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'done';--> statement-breakpoint
ALTER TYPE "project_submission_status" ADD VALUE IF NOT EXISTS 'pending_demo_review';--> statement-breakpoint

ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "source" text DEFAULT 'shop' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "project_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "accepted_at" timestamp with time zone;--> statement-breakpoint

ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "demo_video_url" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "kit_approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "kit_order_id" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "kit_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "package_received_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "demo_submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "done_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project_submissions" ADD COLUMN IF NOT EXISTS "demo_video_url" text DEFAULT '' NOT NULL;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_journals" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE cascade,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"content" text NOT NULL,
	"active_seconds_covered" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_journals_project_id_idx" ON "project_journals" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_journals_user_id_idx" ON "project_journals" USING btree ("user_id");--> statement-breakpoint
