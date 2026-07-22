export interface MarketRecord {
  date: string;
  openPana: string;
  jodi: string;
  closePana: string;
}

export interface PredictionResult {
  targetDate: string;
  predictions: string[];
  confidence: number;
}

export const CUTE_FIGURE: Record<number, number> = {
  0: 5,
  1: 6,
  2: 7,
  3: 8,
  4: 9,
  5: 0,
  6: 1,
  7: 2,
  8: 3,
  9: 4,
};

export function getTotal(value: string): number {
  const sum = value
    .split("")
    .map(Number)
    .reduce((a, b) => a + b, 0);

  return sum % 10;
}

export function getCute(single: number): number {
  return CUTE_FIGURE[single];
}

export function isRedJodi(jodi: string): boolean {
  const red = [
    "16","61","11","66",
    "27","72","22","77",
    "38","83","33","88",
    "49","94","44","99",
    "50","05","55","00"
  ];

  return red.includes(jodi);
}
