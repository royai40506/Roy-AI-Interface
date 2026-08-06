/**
 * Roy Voice API
 * Handles text-to-speech requests.
 */

export interface VoiceRequest {
  text: string;
  language?: string;
}

export async function generateVoice(
  request: VoiceRequest,
): Promise<string | null> {
  try {
    const response = await fetch(
      "https://roy-ai-interface.onrender.com/api/gemini/tts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.audio || null;
  } catch {
    return null;
  }
}
