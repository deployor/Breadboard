CREATE TYPE "public"."project_submission_status" AS ENUM('pending_review', 'approved', 'needs_changes', 'rejected', 'fulfilled');--> statement-breakpoint
CREATE TABLE "project_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"status" "project_submission_status" DEFAULT 'pending_review' NOT NULL,
	"submission_number" integer NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"playable_url" text DEFAULT '' NOT NULL,
	"code_url" text DEFAULT '' NOT NULL,
	"screenshot_url" text DEFAULT '' NOT NULL,
	"address_line1" text DEFAULT '' NOT NULL,
	"address_line2" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"postal_code" text DEFAULT '' NOT NULL,
	"birthday" text DEFAULT '' NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"hours_spent" integer DEFAULT 0 NOT NULL,
	"editor_version_number" integer,
	"approved_hours" integer,
	"internal_note" text DEFAULT '' NOT NULL,
	"user_comment" text DEFAULT '' NOT NULL,
	"bread_amount" integer DEFAULT 0 NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"fulfilled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "project_submissions" (
	"project_id", "user_id", "status", "submission_number", "email", "playable_url", "code_url", "screenshot_url",
	"address_line1", "address_line2", "city", "region", "country", "postal_code", "birthday", "first_name", "last_name",
	"hours_spent", "editor_version_number", "approved_hours", "internal_note", "user_comment", "bread_amount", "submitted_at", "reviewed_at", "fulfilled_at", "created_at", "updated_at"
)
SELECT
	"id", "user_id",
	CASE
		WHEN "status" = 'shipped' THEN 'pending_review'::"project_submission_status"
		WHEN "status" = 'needs_changes' THEN 'needs_changes'::"project_submission_status"
		WHEN "status" = 'rejected' THEN 'rejected'::"project_submission_status"
		WHEN "status" = 'fulfilled' THEN 'fulfilled'::"project_submission_status"
		ELSE 'approved'::"project_submission_status"
	END,
	1, "email", "playable_url", "code_url", "screenshot_url",
	"address_line1", "address_line2", "city", "region", "country", "postal_code", "birthday", "first_name", "last_name",
	"hours_spent", NULL, "override_hours_spent", "override_hours_spent_justification", "review_note", "bread_amount",
	COALESCE("shipped_at", "created_at"), "approved_at",
	CASE WHEN "status" = 'fulfilled' THEN "updated_at" ELSE NULL END,
	"created_at", "updated_at"
FROM "projects"
WHERE "status" IN ('shipped', 'reviewed', 'paid_out', 'fulfilled', 'needs_changes', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_submissions_project_id_idx" ON "project_submissions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_submissions_user_id_idx" ON "project_submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "project_submissions_status_idx" ON "project_submissions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "project_submissions_project_number_idx" ON "project_submissions" USING btree ("project_id","submission_number");
