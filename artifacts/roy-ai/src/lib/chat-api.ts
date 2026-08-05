/**
 * chat-api.ts
 * Streaming SSE client for the Roy AI Gemini backend.
 * Falls back gracefully if the API is unreachable.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export type StreamChunkHandler = (text: string) => void;
export type StreamDoneHandler = (fullText: string) => void;
export type StreamErrorHandler = (err: string) => void;
export type AutomationHandler = (automation: any) => void;
export type ExecutionHandler = (execution: any) => void;
export type PlanHandler = (plan: any[]) => void;

export interface StreamChatOptions {
  messages: ChatMessage[];
  language: string;
  image?: string;
  onChunk: StreamChunkHandler;
  onDone: StreamDoneHandler;
  onError: StreamErrorHandler;
  onAutomation?: AutomationHandler;
  onExecution?: ExecutionHandler;
  onPlan?: PlanHandler;
  signal?: AbortSignal;
}

/** Resolve the API base URL (works in both dev proxy and production). */
function apiBase(): string {
  // In production the backend is co-served under /api.
  // In Vite dev mode the proxy rewrites /api → api-server.
  return "http://localhost:3000/api";
}

export async function streamChat(opts: StreamChatOptions): Promise<void> {
  const {
  messages,
  language,
  image,
  onChunk,
  onDone,
  onError,
  onAutomation,
  onExecution,
  onPlan,
  signal
} = opts;

  let response: Response;
  try {
  console.log("BODY SIZE =", JSON.stringify({ messages, language, image }).length);
    console.log("ROY REQUEST =", { language, hasImage: !!image, messages: messages.length });
    response = await fetch(`${apiBase()}/groq/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, language, image }),
      signal,
    });
  } catch (err) {
    onError(err instanceof Error ? err.message : "Network error");
    return;
  }

  if (!response.ok) {
    onError(`Server error ${response.status}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError("ReadableStream not supported");
    return;
  }

  const decoder = new TextDecoder();
  let accumulated = "";
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // Keep the last (potentially incomplete) line in the buffer
      buffer = lines.pop() ?? "";

      for (const line of lines) {
          console.log("ROY SSE LINE:", line);
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;

        let parsed: { content?: string; done?: boolean; error?: string };
        try {
          parsed = JSON.parse(raw);
        } catch {
          continue;
        }

        if (parsed.error) {
          onError(parsed.error);
          return;
        }

        if ((parsed as any).automation) {
          onAutomation?.((parsed as any).automation);
        }

        if ((parsed as any).execution) {
          onExecution?.((parsed as any).execution);
        }

        if ((parsed as any).plan) {
          onPlan?.((parsed as any).plan);
        }

        if (parsed.content) {
          accumulated += parsed.content;
          onChunk(parsed.content);
        }
          console.log("ROY DONE CALLING ONDONE", accumulated.length);
        console.log("ROY STREAM DONE EVENT", parsed);
          onChunk("___DONE_EVENT___");
        if (parsed.done) {
          onDone(accumulated);
          return;
        }
      }
    }
    // Stream ended without explicit done event
    onDone(accumulated);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return;
    onError(err instanceof Error ? err.message : "Stream error");
  } finally {
    reader.releaseLock();
  }
}
