import { type MarketRecord } from "@workspace/db";
import { predictionScorer } from "./predictionScorer";

type PredictionField = "openPana" | "jodi" | "closePana";

export interface BacktestFieldResult {
  field: PredictionField;
  evaluated: number;
  hitsAt1: number;
  hitsAt4: number;
  hitRateAt1: number;
  hitRateAt4: number;
}

export interface BacktestResult {
  totalRecords: number;
  evaluatedRecords: number;
  skippedRecords: number;
  minimumHistory: number;
  openPana: BacktestFieldResult;
  jodi: BacktestFieldResult;
  closePana: BacktestFieldResult;
}

export class BacktestEngine {
  private readonly minimumHistory = 5;

  run(records: MarketRecord[]): BacktestResult {
    const orderedRecords = [...records].sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    const results: Record<PredictionField, { evaluated: number; hitsAt1: number; hitsAt4: number }> = {
      openPana: { evaluated: 0, hitsAt1: 0, hitsAt4: 0 },
      jodi: { evaluated: 0, hitsAt1: 0, hitsAt4: 0 },
      closePana: { evaluated: 0, hitsAt1: 0, hitsAt4: 0 },
    };

    let evaluatedRecords = 0;

    for (let index = this.minimumHistory; index < orderedRecords.length; index += 1) {
      const history = orderedRecords.slice(0, index);
      const target = orderedRecords[index];

      evaluatedRecords += 1;

      this.evaluateField(
        "openPana",
        history,
        target,
        results.openPana,
      );

      this.evaluateField(
        "jodi",
        history,
        target,
        results.jodi,
      );

      this.evaluateField(
        "closePana",
        history,
        target,
        results.closePana,
      );
    }

    return {
      totalRecords: orderedRecords.length,
      evaluatedRecords,
      skippedRecords: Math.min(
        orderedRecords.length,
        this.minimumHistory,
      ),
      minimumHistory: this.minimumHistory,
      openPana: this.toFieldResult("openPana", results.openPana),
      jodi: this.toFieldResult("jodi", results.jodi),
      closePana: this.toFieldResult("closePana", results.closePana),
    };
  }

  private evaluateField(
    field: PredictionField,
    history: MarketRecord[],
    target: MarketRecord,
    result: { evaluated: number; hitsAt1: number; hitsAt4: number },
  ): void {
    const candidates =
      field === "jodi"
        ? predictionScorer.scoreJodiCandidates(history)
        : predictionScorer.scorePanaCandidates(history, field);

    const predictions = candidates
      .slice(0, 4)
      .map((candidate) => candidate.value);

    result.evaluated += 1;

    if (predictions[0] === target[field]) {
      result.hitsAt1 += 1;
    }

    if (predictions.includes(target[field])) {
      result.hitsAt4 += 1;
    }
  }

  private toFieldResult(
    field: PredictionField,
    result: { evaluated: number; hitsAt1: number; hitsAt4: number },
  ): BacktestFieldResult {
    return {
      field,
      evaluated: result.evaluated,
      hitsAt1: result.hitsAt1,
      hitsAt4: result.hitsAt4,
      hitRateAt1:
        result.evaluated === 0
          ? 0
          : result.hitsAt1 / result.evaluated,
      hitRateAt4:
        result.evaluated === 0
          ? 0
          : result.hitsAt4 / result.evaluated,
    };
  }
}

export const backtestEngine = new BacktestEngine();
