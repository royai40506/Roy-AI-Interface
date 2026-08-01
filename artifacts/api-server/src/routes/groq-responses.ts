import OpenAI from "openai";

export const groqResponses = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export const VISION_MODEL = "qwen/qwen3.6-27b";
