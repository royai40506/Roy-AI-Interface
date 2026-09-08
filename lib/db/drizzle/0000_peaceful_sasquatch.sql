CREATE TABLE "market_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text NOT NULL,
	"open_pana" text NOT NULL,
	"jodi" text NOT NULL,
	"close_pana" text NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"screenshot" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "market_records_date_unique" UNIQUE("date")
);
