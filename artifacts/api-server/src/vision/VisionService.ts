import { groq, MODEL } from "../routes/groq";

import type {
  VisionRequest,
  VisionResult,
} from "./VisionTypes";

export class VisionService {
  async analyze(
    request: VisionRequest
  ): Promise<VisionResult> {

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: request.prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: request.image,
              },
            },
          ],
        },
      ],
    });

    return {
      success: true,
      description:
        response.choices?.[0]?.message?.content ??
        "No vision response.",
    };
  }
}

export const visionService =
  new VisionService();
