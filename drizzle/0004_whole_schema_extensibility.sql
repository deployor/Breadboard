DO $$ BEGIN CREATE TYPE "order_source" AS ENUM ('shop', 'project_kit'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "shipment_status" AS ENUM ('pending', 'label_created', 'in_transit', 'delivered', 'failed', 'returned', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "currency_transaction_type" AS ENUM ('project_payout', 'shop_purchase', 'order_refund', 'admin_adjustment'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "project_lifecycle_state" AS ENUM ('draft', 'materials_submitted', 'materials_changes_requested', 'kit_approved', 'kit_fulfilling', 'kit_sent', 'package_received', 'building', 'demo_submitted', 'demo_changes_requested', 'done', 'rejected', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "project_submission_type" AS ENUM ('materials', 'demo'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "review_decision" AS ENUM ('pending', 'approved', 'changes_requested', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "project_material_type" AS ENUM ('schematic', 'code', 'readme', 'screenshot', 'demo_video', 'extra_requirement'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "project_requirement_phase" AS ENUM ('materials_submission', 'demo_submission'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "project_event_type" AS ENUM ('project_created', 'materials_submitted', 'materials_approved', 'materials_changes_requested', 'kit_order_created', 'kit_order_accepted', 'kit_sent', 'package_received', 'demo_submitted', 'demo_approved', 'demo_changes_requested', 'project_done', 'project_rejected', 'currency_awarded', 'admin_updated'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN ALTER TABLE "account" ADD CONSTRAINT "account_provider_account_idx" UNIQUE ("provider_id", "account_id"); EXCEPTION WHEN duplicate_table THEN null; WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"birthday" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_profiles_user_id_idx" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "user_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"label" text DEFAULT 'default' NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"line1" text DEFAULT '' NOT NULL,
	"line2" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"postal_code" text DEFAULT '' NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_addresses_user_id_idx" ON "user_addresses" USING btree ("user_id");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "product_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_categories_active_idx" ON "product_categories" USING btree ("active");--> statement-breakpoint

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category_id" integer REFERENCES "product_categories"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sku" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metadata" jsonb;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "products" ADD CONSTRAINT "products_price_non_negative" CHECK ("price" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "products" ADD CONSTRAINT "products_stock_non_negative" CHECK ("stock" IS NULL OR "stock" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL REFERENCES "products"("id") ON DELETE cascade,
	"url" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_images_product_id_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "kits" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "kits_active_idx" ON "kits" USING btree ("active");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "kit_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"kit_id" integer NOT NULL REFERENCES "kits"("id") ON DELETE cascade,
	"product_id" integer REFERENCES "products"("id") ON DELETE set null,
	"label" text DEFAULT '' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "kit_items_quantity_positive" CHECK ("quantity" > 0)
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "kit_items_kit_id_idx" ON "kit_items" USING btree ("kit_id");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "currency_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"actor_id" text REFERENCES "user"("id") ON DELETE set null,
	"type" "currency_transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer,
	"source_entity_type" text DEFAULT '' NOT NULL,
	"source_entity_id" text DEFAULT '' NOT NULL,
	"idempotency_key" text NOT NULL UNIQUE,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "currency_transactions_user_id_idx" ON "currency_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "currency_transactions_source_idx" ON "currency_transactions" USING btree ("source_entity_type", "source_entity_id");--> statement-breakpoint

DO $$ BEGIN ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_product_idx" UNIQUE ("cart_id", "product_id"); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_quantity_positive" CHECK ("quantity" > 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "merge_group_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "source" TYPE "order_source" USING "source"::"order_source";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "source" SET DEFAULT 'shop';--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "orders" ADD CONSTRAINT "orders_total_cost_non_negative" CHECK ("total_cost" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_source_project_idx" ON "orders" USING btree ("source", "project_id");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL REFERENCES "orders"("id") ON DELETE cascade,
	"project_id" integer,
	"status" "shipment_status" DEFAULT 'pending' NOT NULL,
	"carrier" text DEFAULT '' NOT NULL,
	"tracking_number" text DEFAULT '' NOT NULL,
	"tracking_url" text DEFAULT '' NOT NULL,
	"label_url" text DEFAULT '' NOT NULL,
	"raw_carrier_payload" jsonb,
	"shipped_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipments_order_id_idx" ON "shipments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipments_project_id_idx" ON "shipments" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipments_status_idx" ON "shipments" USING btree ("status");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "shipment_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipment_id" integer NOT NULL REFERENCES "shipments"("id") ON DELETE cascade,
	"status" "shipment_status" NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_events_shipment_id_idx" ON "shipment_events" USING btree ("shipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_events_occurred_at_idx" ON "shipment_events" USING btree ("occurred_at");--> statement-breakpoint

DO $$ BEGIN ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_product_idx" UNIQUE ("order_id", "product_id"); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_positive" CHECK ("quantity" > 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "order_items" ADD CONSTRAINT "order_items_unit_price_non_negative" CHECK ("unit_price" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "lifecycle_state" "project_lifecycle_state" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "kit_id" integer REFERENCES "kits"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "shipment_id" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "completed_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_lifecycle_state_idx" ON "projects" USING btree ("lifecycle_state");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE cascade,
	"actor_id" text REFERENCES "user"("id") ON DELETE set null,
	"type" "project_event_type" NOT NULL,
	"from_state" "project_lifecycle_state",
	"to_state" "project_lifecycle_state",
	"source_entity_type" text DEFAULT '' NOT NULL,
	"source_entity_id" text DEFAULT '' NOT NULL,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_events_project_id_idx" ON "project_events" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_events_type_idx" ON "project_events" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_events_created_at_idx" ON "project_events" USING btree ("created_at");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_participant_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE cascade,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"email" text DEFAULT '' NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"birthday" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_profiles_project_user_idx" UNIQUE("project_id", "user_id")
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_shipping_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE cascade,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"name" text DEFAULT '' NOT NULL,
	"line1" text DEFAULT '' NOT NULL,
	"line2" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"postal_code" text DEFAULT '' NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"locked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_addresses_project_id_idx" ON "project_shipping_addresses" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_addresses_active_idx" ON "project_shipping_addresses" USING btree ("project_id", "active");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE cascade,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"type" "project_material_type" NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"text_value" text DEFAULT '' NOT NULL,
	"metadata" jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_materials_project_id_idx" ON "project_materials" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_materials_type_idx" ON "project_materials" USING btree ("project_id", "type");--> statement-breakpoint

ALTER TABLE "project_submissions" ADD COLUMN IF NOT EXISTS "type" "project_submission_type" DEFAULT 'materials' NOT NULL;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_hours_non_negative" CHECK ("hours_spent" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_approved_hours_non_negative" CHECK ("approved_hours" IS NULL OR "approved_hours" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_bread_non_negative" CHECK ("bread_amount" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_submission_materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL REFERENCES "project_submissions"("id") ON DELETE cascade,
	"material_id" integer REFERENCES "project_materials"("id") ON DELETE set null,
	"type" "project_material_type" NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"text_value" text DEFAULT '' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submission_materials_submission_id_idx" ON "project_submission_materials" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submission_materials_type_idx" ON "project_submission_materials" USING btree ("submission_id", "type");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE cascade,
	"submission_id" integer NOT NULL REFERENCES "project_submissions"("id") ON DELETE cascade,
	"reviewer_id" text REFERENCES "user"("id") ON DELETE set null,
	"decision" "review_decision" DEFAULT 'pending' NOT NULL,
	"approved_seconds" integer,
	"bread_amount" integer DEFAULT 0 NOT NULL,
	"public_comment" text DEFAULT '' NOT NULL,
	"internal_comment" text DEFAULT '' NOT NULL,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_reviews_bread_non_negative" CHECK ("bread_amount" >= 0)
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_reviews_project_id_idx" ON "project_reviews" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_reviews_submission_id_idx" ON "project_reviews" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_reviews_decision_idx" ON "project_reviews" USING btree ("decision");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_review_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" integer NOT NULL REFERENCES "project_reviews"("id") ON DELETE cascade,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_review_checks_review_key_idx" UNIQUE("review_id", "key")
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_requirement_definitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"phase" "project_requirement_phase" NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"material_type" "project_material_type" NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "requirement_definitions_phase_key_idx" UNIQUE("phase", "key")
);--> statement-breakpoint

ALTER TABLE "project_journals" ADD COLUMN IF NOT EXISTS "covers_from" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project_journals" ADD COLUMN IF NOT EXISTS "covers_to" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project_journals" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "project_journals" ADD CONSTRAINT "project_journals_active_seconds_non_negative" CHECK ("active_seconds_covered" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN ALTER TABLE "editor_activity_sessions" ADD CONSTRAINT "activity_sessions_seconds_non_negative" CHECK ("active_seconds" >= 0); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_time_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE cascade,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"source_session_id" integer REFERENCES "editor_activity_sessions"("id") ON DELETE set null,
	"journal_id" integer REFERENCES "project_journals"("id") ON DELETE set null,
	"active_seconds" integer NOT NULL,
	"counted" boolean DEFAULT true NOT NULL,
	"counted_until_state" "project_lifecycle_state",
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_time_entries_seconds_positive" CHECK ("active_seconds" > 0)
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_time_entries_project_id_idx" ON "project_time_entries" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_time_entries_user_id_idx" ON "project_time_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_time_entries_journal_id_idx" ON "project_time_entries" USING btree ("journal_id");--> statement-breakpoint
