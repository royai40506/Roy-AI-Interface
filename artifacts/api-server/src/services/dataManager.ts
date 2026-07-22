export interface MarketRecord {
  date: string;
  openPana: string;
  jodi: string;
  closePana: string;
}

export class DataManager {
  private records: MarketRecord[] = [];

  add(record: MarketRecord): void {
    const exists = this.records.find(r => r.date === record.date);

    if (exists) {
      exists.openPana = record.openPana;
      exists.jodi = record.jodi;
      exists.closePana = record.closePana;
      return;
    }

    this.records.push(record);

    this.records.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  getAll(): MarketRecord[] {
    return this.records;
  }

  getByDate(date: string): MarketRecord | undefined {
    return this.records.find(r => r.date === date);
  }

  getBeforeDate(date: string): MarketRecord[] {
    const target = new Date(date).getTime();

    return this.records.filter(r => {
      return new Date(r.date).getTime() < target;
    });
  }

  count(): number {
    return this.records.length;
  }

  clear(): void {
    this.records = [];
  }
}

export const dataManager = new DataManager();
