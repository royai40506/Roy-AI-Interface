import { spawn } from "node:child_process";

export interface PiperResult {
  audio: string | null;
  alignment: null;
}

const PIPER_BIN = process.env.PIPER_BIN;
const PIPER_MODEL = process.env.PIPER_MODEL;
const PIPER_MODELS = {
  hi: "/data/data/com.termux/files/home/piper-runtime/models/hi_IN-priyamvada-medium/hi_IN-priyamvada-medium.onnx",
  mr: "/data/data/com.termux/files/home/piper-runtime/models/mr_IN-google-medium/mr_IN-google-medium.onnx",
  en: "/data/data/com.termux/files/home/piper-runtime/models/en_US-amy-medium/en_US-amy-medium.onnx",
};



function createWavBuffer(pcm: Buffer): Buffer {
  const sampleRate = 22050;
  const channels = 1;
  const bitsPerSample = 16;

  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);

  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 28);
  header.writeUInt16LE(channels * bitsPerSample / 8, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}


export async function generatePiperVoice(
  text: string,
  language: string = "hi",
): Promise<PiperResult | null> {
  if (!PIPER_BIN || !PIPER_MODEL) {
    console.warn("[PIPER] Not configured");
    return null;
  }

  return await new Promise((resolve) => {
    console.log("[PIPER MODEL]", PIPER_MODELS[language as keyof typeof PIPER_MODELS] || PIPER_MODEL);

    const chunks: Buffer[] = [];

    const piper = spawn("proot-distro", [
      "login",
      "ubuntu",
      "--",
      "/root/piper-env/bin/python",
      "-m",
      "piper",
      "--model",
      PIPER_MODELS[language as keyof typeof PIPER_MODELS] || PIPER_MODEL,
      "--config",
      (PIPER_MODELS[language as keyof typeof PIPER_MODELS] || PIPER_MODEL) + ".json",
      "--output-raw",
    ]);

    piper.stdin.write(text);
    piper.stdin.end();

    piper.stdout.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    piper.stderr.on("data", (data) => {
      console.error("[PIPER STDERR]", data.toString());
    });

    piper.on("close", (code) => {
      console.log("[PIPER EXIT]", code);

      if (code !== 0) {
        resolve(null);
        return;
      }

      const pcm = Buffer.concat(chunks);
      const wav = createWavBuffer(pcm);

      console.log("[TTS] PCM bytes:", pcm.length);
      console.log("[TTS] WAV bytes:", wav.length);

      console.log("[TTS] PCM bytes:", pcm.length);
      console.log("[TTS] WAV bytes:", wav.length);

      resolve({
        audio: wav.toString("base64"),
        alignment: null,
      });
    });

    piper.on("error", () => resolve(null));
  });
}
