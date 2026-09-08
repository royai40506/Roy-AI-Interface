import { type MarketRecord } from "@workspace/db";
import { getTotal } from "./knowledgeEngine";

export interface ScoredCandidate {
  value: string;
  score: number;
  support: number;
  transitionSupport: number;
  totalSupport: number;
}

type PanaField = "openPana" | "closePana";

export class PredictionScorer {
  scorePanaCandidates(
    records: MarketRecord[],
    field: PanaField,
  ): ScoredCandidate[] {
    const frequency = new Map<string, number>();
    const totalFrequency = new Map<number, number>();
    const transitionFrequency = new Map<string, number>();
    const latestValue = records.at(-1)?.[field];

    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      const value = record[field];
      const total = getTotal(value);

      frequency.set(value, (frequency.get(value) ?? 0) + 1);
      totalFrequency.set(total, (totalFrequency.get(total) ?? 0) + 1);

      if (
        latestValue !== undefined &&
        index > 0 &&
        records[index - 1][field] === latestValue
      ) {
        transitionFrequency.set(
          value,
          (transitionFrequency.get(value) ?? 0) + 1,
        );
      }
    }

    return [...frequency.entries()]
      .map(([value, support]) => {
        const totalSupport = totalFrequency.get(getTotal(value)) ?? 0;
        const transitionSupport = transitionFrequency.get(value) ?? 0;

        return {
          value,
          support,
          transitionSupport,
          totalSupport,
          score: support,
        };
      })
      .sort(
        (a, b) =>
          b.support - a.support ||
          b.transitionSupport - a.transitionSupport ||
          b.totalSupport - a.totalSupport ||
          a.value.localeCompare(b.value),
      );
  }

  scoreJodiCandidates(records: MarketRecord[]): ScoredCandidate[] {
    const frequency = new Map<string, number>();
    const totalFrequency = new Map<number, number>();
    const transitionFrequency = new Map<string, number>();
    const latestValue = records.at(-1)?.jodi;

    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      const value = record.jodi;
      const total = getTotal(value);

      frequency.set(value, (frequency.get(value) ?? 0) + 1);
      totalFrequency.set(total, (totalFrequency.get(total) ?? 0) + 1);

      if (
        latestValue !== undefined &&
        index > 0 &&
        records[index - 1].jodi === latestValue
      ) {
        transitionFrequency.set(
          value,
          (transitionFrequency.get(value) ?? 0) + 1,
        );
      }
    }

    return [...frequency.entries()]
      .map(([value, support]) => {
        const totalSupport = totalFrequency.get(getTotal(value)) ?? 0;
        const transitionSupport = transitionFrequency.get(value) ?? 0;

        return {
          value,
          support,
          transitionSupport,
          totalSupport,
          score: support,
        };
      })
      .sort(
        (a, b) =>
          b.support - a.support ||
          b.transitionSupport - a.transitionSupport ||
          b.totalSupport - a.totalSupport ||
          a.value.localeCompare(b.value),
      );
  }
}

export const predictionScorer = new PredictionScorer();
