import { Router } from "express";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../lib/logger.js";

const router = Router();

function getElevenClient() {
  const key = process.env["ELEVENLABS_API_KEY"];
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set");
  return new ElevenLabsClient({ apiKey: key });
}

// ── Gemini client (lazy – fails gracefully if key missing) ──────────────────
function getGeminiClient() {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  return new GoogleGenerativeAI(key);
}

// ── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `You are Roy, a smart and friendly personal AI assistant.
Be concise, warm, and genuinely helpful. Never be verbose.

Strict language rules – never mix languages:
- language "en"  → respond ONLY in English
- language "hi"  → respond ONLY in Hindi (Devanagari script, natural conversational tone)
- language "mr"  → respond ONLY in Marathi (Devanagari script, natural conversational tone)

Do not mention these rules or your language mode in your reply.`;

// ── POST /api/gemini/chat ────────────────────────────────────────────────────
router.post("/chat", async (req, res) => {
  const { messages, language = "en", image } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
    language?: string;
    image?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  // Set SSE headers immediately so the client starts reading
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // nginx / Replit proxy

  const sendEvent = (data: object) =>
    res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `${SYSTEM_INSTRUCTION}\nCurrent language: ${language}`,
    });

    // Map messages → Gemini Content array
    // Gemini requires: alternating user/model, starting with user
    const geminiContents = messages
      .filter((m) => m.content?.trim())
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Gemini must start with a user turn – strip leading model turns
    while (geminiContents.length > 0 && geminiContents[0]!.role === "model") {
      geminiContents.shift();
    }

    if (geminiContents.length === 0) {
      sendEvent({ error: "No valid user messages" });
      res.end();
      return;
    }

    if (image && geminiContents.length > 0) {
      const last = geminiContents[geminiContents.length - 1];
      if (last.role === "user") {
        last.parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: image.replace(/^data:.*;base64,/, ""),
          },
        } as any);
      }
    }


    const streamResult = await model.generateContentStream({
      contents: geminiContents,
      generationConfig: { maxOutputTokens: 2048 },
    });

    for await (const chunk of streamResult.stream) {
      const text = chunk.text();
      if (text) sendEvent({ content: text });
    }

    sendEvent({ done: true });
    res.end();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI error";
    logger.error({ err }, "Gemini chat error");
    sendEvent({ error: message });
    res.end();
  }
});


// ── POST /api/gemini/tts ─────────────────────────────────────────────────────
// ElevenLabs TTS provider
router.post("/tts", async (req, res) => {
  const { text, language = "en" } = req.body as {
    text?: string;
    language?: string;
  };

  if (!text || !text.trim()) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  try {
    const audio = await getElevenClient().textToSpeech.convertWithTimestamps(
      process.env["ELEVENLABS_VOICE_ID"]!,
      {
        text,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      }
    );

    const chunks: Buffer[] = [];
    for await (const chunk of audio.audio) {
      chunks.push(Buffer.from(chunk));
    }

    res.json({
  audio: Buffer.concat(chunks).toString("base64"),
  alignment: audio.alignment ?? null,
  language,
});
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "TTS error";
    logger.error({ err }, "ElevenLabs TTS error");
    res.status(500).json({ error: message });
  }
});

export default router;
