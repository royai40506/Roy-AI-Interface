import { Router } from "express";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { groq, MODEL } from "./groq.js";
import { logger } from "../lib/logger.js";

const router = Router();

function getElevenClient() {
  const key = process.env["ELEVENLABS_API_KEY"];
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set");
  return new ElevenLabsClient({ apiKey: key });
}

const SYSTEM_INSTRUCTION = `You are Roy, a smart and friendly personal AI assistant.
Be concise, warm, and genuinely helpful. Never be verbose.

Strict language rules:
- language "en" -> respond only in English
- language "hi" -> respond only in Hindi
- language "mr" -> respond only in Marathi`;

router.post("/chat", async (req, res): Promise<void> => {
  const { messages, language = "en", image } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const send = (obj: unknown) =>
    res.write(`data: ${JSON.stringify(obj)}\n\n`);

  try {
    console.log("HAS IMAGE =", !!image);

    const stream = await groq.chat.completions.create({
      model: MODEL,
      stream: true,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION + "\nCurrent language: " + language,
        },
        ...messages.map((m: any, i: number) => ({
          role: m.role,
          content:
            image &&
            i === messages.length - 1 &&
            m.role === "user"
              ? [
                  { type: "text", text: m.content },
                  { type: "image_url", image_url: { url: image } },
                ]
              : m.content,
        })),
      ],
    });

    let thinking = false;

    for await (const chunk of stream) {
      let text = chunk.choices?.[0]?.delta?.content ?? "";

      if (!text) continue;

      if (text.includes("<think>")) thinking = true;

      if (thinking) {
        if (text.includes("</think>")) thinking = false;
        continue;
      }

      send({ content: text });
    }

    send({ done: true });
    res.end();
  } catch (err) {
    logger.error({ err }, "Groq chat error");
    send({ error: err instanceof Error ? err.message : "AI error" });
    res.end();
  }
});

router.post("/tts", async (req, res): Promise<void> => {
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
