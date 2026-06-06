CREATE TYPE "project_status" AS ENUM ('draft', 'shipped', 'needs_changes', 'approved', 'rejected');

CREATE TABLE "projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "status" "project_status" DEFAULT 'draft' NOT NULL,
  "title" text DEFAULT 'Untitled project' NOT NULL,
  "email" text DEFAULT '' NOT NULL,
  "playable_url" text DEFAULT '' NOT NULL,
  "code_url" text DEFAULT '' NOT NULL,
  "screenshot_url" text DEFAULT '' NOT NULL,
  "description" text DEFAULT '' NOT NULL,
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
  "override_hours_spent" integer,
  "override_hours_spent_justification" text DEFAULT '' NOT NULL,
  "review_note" text DEFAULT '' NOT NULL,
  "credited_amount" integer DEFAULT 0 NOT NULL,
  "approved_at" timestamp with time zone,
  "shipped_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "projects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
);

CREATE INDEX "projects_user_id_idx" ON "projects" USING btree ("user_id");
