import { MarketRecord } from "./dataManager";
import { getTotal, isRedJodi } from "./knowledgeEngine";

export class PatternAnalyzer {

  analyze(records: MarketRecord[]) {
    return {
      totalRecords: records.length,
      redJodiCount: records.filter(r => isRedJodi(r.jodi)).length,
      openTotals: records.map(r => getTotal(r.openPana)),
      closeTotals: records.map(r => getTotal(r.closePana))
    };
  }

  getRecent(records: MarketRecord[], limit = 30): MarketRecord[] {
    return records.slice(-limit);
  }

  getHistoryByJodi(records: MarketRecord[], jodi: string): MarketRecord[] {
    return records.filter(r => r.jodi === jodi);
  }

  getHistoryByTotal(records: MarketRecord[], total: number): MarketRecord[] {
    return records.filter(r => getTotal(r.jodi) === total);
  }
}

export const patternAnalyzer = new PatternAnalyzer();
