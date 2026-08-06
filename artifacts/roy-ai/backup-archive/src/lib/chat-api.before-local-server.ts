/**
 * chat-api.ts
 * Streaming SSE client for the Roy AI Gemini backend.
 * Falls back gracefully if the API is unreachable.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type StreamChunkHandler = (text: string) => void;
export type StreamDoneHandler = (fullText: string) => void;
export type StreamErrorHandler = (err: string) => void;

export interface StreamChatOptions {
  messages: ChatMessage[];
  language: string;
  onChunk: StreamChunkHandler;
  onDone: StreamDoneHandler;
  onError: StreamErrorHandler;
  signal?: AbortSignal;
}

/** Resolve the API base URL (works in both dev proxy and production). */
function apiBase(): string {
  // In production the backend is co-served under /api.
  // In Vite dev mode the proxy rewrites /api → api-server.
  return "https://roy-ai-interface.onrender.com/api";
}

export async function streamChat(opts: StreamChatOptions): Promise<void> {
  const { messages, language, onChunk, onDone, onError, signal } = opts;

  let response: Response;
  try {
    response = await fetch(`${apiBase()}/gemini/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, language }),
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
        if (parsed.content) {
          accumulated += parsed.content;
          onChunk(parsed.content);
        }
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
