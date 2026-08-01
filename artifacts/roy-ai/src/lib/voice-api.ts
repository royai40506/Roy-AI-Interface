/**
 * Roy Voice API
 * Handles text-to-speech requests.
 */

export interface VoiceRequest {
  text: string;
  language?: string;
}

export interface VoiceResponse {
  audio: string | null;
  alignment?: unknown;
}

export async function generateVoice(
  request: VoiceRequest,
): Promise<VoiceResponse | null> {
  try {
    console.log("ROY GENERATE VOICE CALLED", request.text.length);

    const response = await fetch(
      "http://localhost:3000/api/gemini/tts",
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

    return {
      audio: data.audio || null,
      alignment: data.alignment || null,
    };

  } catch {
    return null;
  }
}
