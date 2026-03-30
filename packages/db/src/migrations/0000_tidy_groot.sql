CREATE TYPE "public"."email_sequence_status" AS ENUM('pending', 'sent', 'cancelled', 'opened', 'clicked');--> statement-breakpoint
CREATE TYPE "public"."failed_payment_status" AS ENUM('detected', 'emailing', 'escalated', 'recovered', 'lost');--> statement-breakpoint
CREATE TYPE "public"."subscription_event_type" AS ENUM('downgrade', 'upgrade', 'cancelled', 'reactivated');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beta_signup" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_sequences" (
	"id" text PRIMARY KEY NOT NULL,
	"failed_payment_id" text,
	"step" integer NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"send_at" timestamp NOT NULL,
	"opened_at" timestamp,
	"status" "email_sequence_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escalations" (
	"id" text PRIMARY KEY NOT NULL,
	"failed_payment_id" text,
	"user_id" text,
	"triggered_at" timestamp DEFAULT now() NOT NULL,
	"reason" text NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "failed_payments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"stripe_payment_intent_id" text NOT NULL,
	"stripe_customer_id" text,
	"customer_email" text NOT NULL,
	"customer_name" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"failure_reason" text NOT NULL,
	"product_name" text,
	"status" "failed_payment_status" DEFAULT 'detected' NOT NULL,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"recovered_at" timestamp,
	CONSTRAINT "failed_payments_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"escalation_threshold" integer DEFAULT 200,
	"notification_email" text,
	"timezone" text DEFAULT 'UTC',
	"morning_brief_enabled" boolean DEFAULT true NOT NULL,
	"morning_brief_time" text DEFAULT '07:00' NOT NULL,
	"slack_webhook_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_connection" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"stripe_account_id" text,
	"access_token" text,
	"refresh_token" text,
	"webhook_endpoint_id" text,
	"webhook_secret" text,
	"connected_at" timestamp DEFAULT now() NOT NULL,
	"last_sync_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"customer_email" text NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"type" "subscription_event_type" NOT NULL,
	"previous_amount" integer NOT NULL,
	"new_amount" integer NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_sequences" ADD CONSTRAINT "email_sequences_failed_payment_id_failed_payments_id_fk" FOREIGN KEY ("failed_payment_id") REFERENCES "public"."failed_payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalations" ADD CONSTRAINT "escalations_failed_payment_id_failed_payments_id_fk" FOREIGN KEY ("failed_payment_id") REFERENCES "public"."failed_payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalations" ADD CONSTRAINT "escalations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failed_payments" ADD CONSTRAINT "failed_payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_connection" ADD CONSTRAINT "stripe_connection_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");