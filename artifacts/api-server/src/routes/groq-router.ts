import { Router } from "express";
import { groq, MODEL } from "./groq.js";
import { logger } from "../lib/logger.js";
import { brainManager } from "../brain/index.js";
import { brainExecutionPipeline } from "../brain/BrainExecutionPipeline.js";
import { memoryService } from "../memory/index.js";
import { visionService } from "../vision/index.js";
import { generatePiperVoice } from "../services/piper.js";

const router = Router();

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


    const decision =
      brainExecutionPipeline.execute({
        messages,
        language,
        image,
      });

    console.log(
      "[AI BRAIN]",
      decision.decision.intent,
      "| confidence:",
      decision.decision.confidence,
      "| reason:",
      decision.decision.reason
    );

    if (decision.execution) {
      console.log("[BRAIN EXECUTION]", decision.execution);
    }

    if (decision.plan) {
      console.log("[BRAIN PLAN]", decision.plan);
    }

    const selectedIntent = decision.decision.intent;
    const reasoningRequest =
  selectedIntent === "reasoning";

const systemInstruction =
  reasoningRequest
    ? SYSTEM_INSTRUCTION +
      "\nThink carefully and solve step by step internally. Return only the final answer."
    : SYSTEM_INSTRUCTION;
    const lastMessage =
      messages[messages.length - 1]?.content ?? "";

    const extracted =
      memoryService.extract(lastMessage);

    if (extracted) {
      memoryService.save(
        extracted.category,
        extracted.key,
        extracted.value
      );

      console.log("[MEMORY SAVED]", extracted);
    }

    if (
      selectedIntent === "memory" &&
      /what('?s| is)? my name|who am i/i.test(lastMessage)
    ) {
      const memory = memoryService.load("name");

      if (memory) {
        send({
          content: `Your name is ${memory.value}.`
        });

        send({ done: true });
        res.end();
        return;
      }
    }

    if (
      selectedIntent === "automation" &&
      decision.execution
    ) {
      send({
        automation: decision.execution
      });

      send({ done: true });
      res.end();
      return;
    }

    if (selectedIntent === "vision" && image) {
      const result = await visionService.analyze({
        image,
        prompt:
          messages[messages.length - 1]?.content ?? "",
        language,
      });

      send({ content: result.description });
      send({ done: true });
      res.end();
      return;
    }

    // Vision validation
    if (selectedIntent === "vision" && !image) {
      send({
        error: "Vision request received but no image was provided."
      });
      send({ done: true });
      res.end();
      return;
    }


    const stream = await groq.chat.completions.create({

      model: MODEL,
      stream: true,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemInstruction + "\nCurrent language: " + language,
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
      console.error("FULL ERROR:", err);

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
    console.log("[TTS] Request received:", text.length);

    const result = await generatePiperVoice(text);

    console.log("[TTS] Piper generated:", !!result?.audio);

    res.json({
      audio: result?.audio ?? null,
      alignment: null,
      language,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "TTS error";
    logger.error({ err }, "ElevenLabs TTS error");
    res.status(500).json({ error: message });
  }
});

export default router;
