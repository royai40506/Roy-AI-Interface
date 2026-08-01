import { Router } from "express";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import Groq from "groq-sdk";
import { logger } from "../lib/logger.js";

const router = Router();

function getElevenClient() {
  const key = process.env["ELEVENLABS_API_KEY"];
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set");
  return new ElevenLabsClient({ apiKey: key });
}

// ── Gemini client (lazy – fails gracefully if key missing) ──────────────────
function getGroqClient() {
  const key = process.env["GROQ_API_KEY"];
  if (!key) throw new Error("GROQ_API_KEY is not set");
  return new Groq({ apiKey: key });
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
require("fs").appendFileSync(
"/sdcard/Download/roy-vision-debug.txt",
"\nHAS_IMAGE=" + (!!image) +
"\nIMAGE_LENGTH=" + (image ? String(image).length : 0) +
"\nIMAGE_PREFIX=" + (image ? String(image).slice(0,60) : "NONE") +
"\n----------------\n"
);
console.log("HAS IMAGE =", !!image);
console.log("IMAGE LENGTH =", image ? String(image).length : 0);
console.log("IMAGE DEBUG =", image ? String(image).slice(0,80) : "NO_IMAGE");
console.log("IMAGE TYPE =", image ? (String(image).startsWith("data:") ? "BASE64" : String(image).startsWith("blob:") ? "BLOB" : "OTHER") : "NONE");
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
  const groq = getGroqClient();

  const chatMessages: any[] = [];

  for (const m of messages) {
    if (!m.content?.trim()) continue;

    const content: any[] = [{ type: "text", text: m.content }];

    if (image && m === messages[messages.length - 1] && m.role === "user") {
      content.push({
        type: "image_url",
        image_url: { url: image },
      });
    }

    chatMessages.push({
      role: m.role,
      content,
    });
  }

  if (chatMessages.length === 0) {
    sendEvent({ error: "No valid user messages" });
    res.end();
    return;
  }

  console.log(JSON.stringify(chatMessages, null, 2));

const stream = await groq.chat.completions.create({
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    messages: chatMessages,
    temperature: 0.7,
    max_completion_tokens: 2048,
    stream: true,
  });

  for await (const chunk of stream) {
    const text = chunk.choices?.[0]?.delta?.content;
    if (text) sendEvent({ content: text });
  }

  sendEvent({ done: true });
  res.end();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : "AI error";
  logger.error({ err }, "Groq chat error");
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

    res.json({
      audio: audio.audioBase64,
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
