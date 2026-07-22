import { MarketRecord } from "./dataManager";

export class DatasetManager {
  private dataset: MarketRecord[] = [];

  load(records: MarketRecord[]) {
    this.dataset = [...records];
  }

  add(record: MarketRecord) {
    this.dataset.push(record);
  }

  import(records: MarketRecord[]) {
    this.dataset.push(...records);
  }

  getAll(): MarketRecord[] {
    return this.dataset;
  }

  findByDate(date: string): MarketRecord | undefined {
    return this.dataset.find(r => r.date === date);
  }

  clear() {
    this.dataset = [];
  }

  size() {
    return this.dataset.length;
  }
}

export const datasetManager = new DatasetManager();
