export interface StorageMessage {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
  image?: string;
}

export interface StorageStats {
  totalMessages: number;
  estimatedSize: number;
}

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
