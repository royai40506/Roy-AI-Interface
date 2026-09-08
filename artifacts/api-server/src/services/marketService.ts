import {
  insertMarketRecordSchema,
  type InsertMarketRecord,
  type MarketRecord,
} from "@workspace/db";
import { marketRepository } from "./marketRepository";

export class MarketService {
  async getAll(): Promise<MarketRecord[]> {
    return marketRepository.getAll();
  }

  async getByDate(date: string): Promise<MarketRecord | undefined> {
    return marketRepository.getByDate(date);
  }

  async upsert(input: unknown): Promise<MarketRecord> {
    const record = insertMarketRecordSchema.parse(input);
    return marketRepository.upsert(record);
  }

  async deleteByDate(date: string): Promise<MarketRecord | undefined> {
    return marketRepository.deleteByDate(date);
  }
}

export const marketService = new MarketService();
