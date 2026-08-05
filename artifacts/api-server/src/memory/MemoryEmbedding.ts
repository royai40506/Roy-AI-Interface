import { GoogleGenerativeAI } from "@google/generative-ai";

export interface MemoryEmbedding {
  key: string;
  text: string;
  vector: number[];
  model: string;
}

export class MemoryEmbeddingEngine {
  private readonly modelName = "gemini-embedding-001";
  private readonly client: GoogleGenerativeAI;

  constructor() {
    const key = process.env["GEMINI_API_KEY"];

    if (!key) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    this.client = new GoogleGenerativeAI(key);
  }

  create(text: string): MemoryEmbedding {
    return {
      key: text,
      text,
      vector: [],
      model: this.modelName,
    };
  }

  async generate(text: string): Promise<number[]> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
    });

    const result = await model.embedContent(text);

    return result.embedding.values;
  }

  async createAsync(text: string): Promise<MemoryEmbedding> {
    const vector = await this.generate(text);

    return {
      key: text,
      text,
      vector,
      model: this.modelName,
    };
  }
}

export const memoryEmbeddingEngine = new MemoryEmbeddingEngine();
