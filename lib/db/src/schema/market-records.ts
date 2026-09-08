import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const marketRecords = pgTable("market_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: text("date").notNull().unique(),
  openPana: text("open_pana").notNull(),
  jodi: text("jodi").notNull(),
  closePana: text("close_pana").notNull(),
  source: text("source").notNull().default("manual"),
  screenshot: text("screenshot"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertMarketRecordSchema = createInsertSchema(marketRecords)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    openPana: z.string().regex(/^\d{3}$/, "Open pana must be exactly 3 digits"),
    jodi: z.string().regex(/^\d{2}$/, "Jodi must be exactly 2 digits"),
    closePana: z.string().regex(/^\d{3}$/, "Close pana must be exactly 3 digits"),
    source: z.string().min(1, "Source is required"),
  });

export type InsertMarketRecord = z.infer<typeof insertMarketRecordSchema>;
export type MarketRecord = typeof marketRecords.$inferSelect;
