import { type MarketRecord } from "@workspace/db";
import { getTotal, isRedJodi } from "./knowledgeEngine";

export interface MarketRecordFeatures {
  date: string;
  openPana: string;
  jodi: string;
  closePana: string;
  openTotal: number;
  jodiTotal: number;
  closeTotal: number;
  redJodi: boolean;
}

export interface FeatureSummary {
  totalRecords: number;
  recentRecords: number;
  openTotalFrequency: Record<number, number>;
  jodiTotalFrequency: Record<number, number>;
  closeTotalFrequency: Record<number, number>;
  redJodiCount: number;
  records: MarketRecordFeatures[];
}

export class FeatureEngine {
  extractRecord(record: MarketRecord): MarketRecordFeatures {
    return {
      date: record.date,
      openPana: record.openPana,
      jodi: record.jodi,
      closePana: record.closePana,
      openTotal: getTotal(record.openPana),
      jodiTotal: getTotal(record.jodi),
      closeTotal: getTotal(record.closePana),
      redJodi: isRedJodi(record.jodi),
    };
  }

  summarize(
    records: MarketRecord[],
    recentLimit = 30,
  ): FeatureSummary {
    const features = records.map((record) => this.extractRecord(record));
    const recentRecords = features.slice(-recentLimit);

    const openTotalFrequency = this.countTotals(
      recentRecords.map((record) => record.openTotal),
    );

    const jodiTotalFrequency = this.countTotals(
      recentRecords.map((record) => record.jodiTotal),
    );

    const closeTotalFrequency = this.countTotals(
      recentRecords.map((record) => record.closeTotal),
    );

    return {
      totalRecords: features.length,
      recentRecords: recentRecords.length,
      openTotalFrequency,
      jodiTotalFrequency,
      closeTotalFrequency,
      redJodiCount: recentRecords.filter((record) => record.redJodi).length,
      records: features,
    };
  }

  private countTotals(values: number[]): Record<number, number> {
    const frequency: Record<number, number> = {};

    for (let total = 0; total <= 9; total += 1) {
      frequency[total] = 0;
    }

    for (const value of values) {
      frequency[value] += 1;
    }

    return frequency;
  }
}

export const featureEngine = new FeatureEngine();
