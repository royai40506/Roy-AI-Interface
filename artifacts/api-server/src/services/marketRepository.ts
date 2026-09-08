import { asc, eq } from "drizzle-orm";
import { db, marketRecords, type InsertMarketRecord } from "@workspace/db";

export class MarketRepository {
  async getAll() {
    return db
      .select()
      .from(marketRecords)
      .orderBy(asc(marketRecords.date));
  }

  async getByDate(date: string) {
    const rows = await db
      .select()
      .from(marketRecords)
      .where(eq(marketRecords.date, date))
      .limit(1);

    return rows[0];
  }

  async create(record: InsertMarketRecord) {
    const rows = await db
      .insert(marketRecords)
      .values(record)
      .returning();

    return rows[0];
  }

  async upsert(record: InsertMarketRecord) {
    const rows = await db
      .insert(marketRecords)
      .values(record)
      .onConflictDoUpdate({
        target: marketRecords.date,
        set: {
          openPana: record.openPana,
          jodi: record.jodi,
          closePana: record.closePana,
          source: record.source,
          screenshot: record.screenshot,
          updatedAt: new Date(),
        },
      })
      .returning();

    return rows[0];
  }

  async deleteByDate(date: string) {
    const rows = await db
      .delete(marketRecords)
      .where(eq(marketRecords.date, date))
      .returning();

    return rows[0];
  }
}

export const marketRepository = new MarketRepository();
