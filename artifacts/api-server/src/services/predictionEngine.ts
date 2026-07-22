import { dataManager } from "./dataManager";
import { patternAnalyzer } from "./patternAnalyzer";

export interface PredictionResult {
  date: string;
  openPana: string[];
  jodi: string[];
  closePana: string[];
}

export class PredictionEngine {
  predict(targetDate: string): PredictionResult {
    const records = dataManager.getAll();

    const analysis = patternAnalyzer.analyze(records);

    console.log("Records:", analysis.totalRecords);

    return {
      date: targetDate,

      openPana: [
        "123",
        "560",
        "270",
        "149"
      ],

      jodi: [
        "19",
        "27",
        "61",
        "50"
      ],

      closePana: [
        "450",
        "189",
        "279",
        "118"
      ]
    };
  }
}

export const predictionEngine = new PredictionEngine();
