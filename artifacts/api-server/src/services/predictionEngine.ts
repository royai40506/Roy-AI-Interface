import { marketRepository } from "./marketRepository";
import { patternAnalyzer } from "./patternAnalyzer";
import { featureEngine } from "./featureEngine";
import { predictionScorer } from "./predictionScorer";

export interface PredictionResult {
  date: string;
  openPana: string[];
  jodi: string[];
  closePana: string[];
}

export class PredictionEngine {
  async predict(targetDate: string): Promise<PredictionResult> {
    const records = await marketRepository.getAll();
    const history = records.filter((record) => record.date < targetDate);

    const analysis = patternAnalyzer.analyze(history);
    const features = featureEngine.summarize(history);

    console.log("Records:", analysis.totalRecords);
    console.log("Recent feature records:", features.recentRecords);

    if (history.length < 5) {
      throw new Error("Insufficient historical data for prediction");
    }

    const openPana = predictionScorer
      .scorePanaCandidates(history, "openPana")
      .slice(0, 4)
      .map((candidate) => candidate.value);

    const jodi = predictionScorer
      .scoreJodiCandidates(history)
      .slice(0, 4)
      .map((candidate) => candidate.value);

    const closePana = predictionScorer
      .scorePanaCandidates(history, "closePana")
      .slice(0, 4)
      .map((candidate) => candidate.value);

    return {
      date: targetDate,
      openPana,
      jodi,
      closePana,
    };
  }
}

export const predictionEngine = new PredictionEngine();
