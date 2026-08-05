export interface VisionRequest {
  image: string;
  prompt: string;
  language: string;
}

export interface VisionResult {
  success: boolean;
  description: string;
}
