import {
  STORAGE_KEY,
  MAX_MESSAGES,
  MAX_STORAGE_SIZE
} from "./StorageLimits";

import type {
  StorageMessage,
  StorageResult
} from "./StorageTypes";

export class StorageManager {

  private sanitize(messages: StorageMessage[]): StorageMessage[] {
    return messages.map(msg => ({
      ...msg,
      image:
        msg.image && msg.image.startsWith("data:")
          ? "[IMAGE_REMOVED]"
          : msg.image
    }));
  }



  private removeDuplicates(
    messages: StorageMessage[]
  ): StorageMessage[] {

    const seen = new Set<string>();

    return messages.filter(msg => {

      const key =
        msg.role + "|" + msg.content;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;

    });

  }


  private fitSize(messages: StorageMessage[]): StorageMessage[] {
    let result = [...messages];

    while (
      JSON.stringify(result).length > MAX_STORAGE_SIZE &&
      result.length > 1
    ) {
      result.shift();
    }

    return result;
  }

  load(): StorageResult<StorageMessage[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return {
          success: true,
          data: []
        };
      }

      return {
        success: true,
        data: JSON.parse(raw)
      };

    } catch {

      localStorage.removeItem(STORAGE_KEY);

      return {
        success: false,
        data: [],
        error: "Storage corrupted"
      };
    }
  }

  save(messages: StorageMessage[]): StorageResult<boolean> {

    let cleaned = this.fitSize(this.removeDuplicates(
      this.sanitize(
        messages.slice(-MAX_MESSAGES)
      ))
    );

    while (cleaned.length > 1) {

      try {

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(cleaned)
        );

        return {
          success: true,
          data: true
        };

      } catch {

        cleaned.shift();

      }

    }

    localStorage.removeItem(STORAGE_KEY);

    return {
      success: false,
      data: false,
      error: "Quota exceeded"
    };
  }



  stats() {
    const result = this.load();

    const messages = result.data ?? [];

    const size = JSON.stringify(messages).length;

    return {
      messages: messages.length,
      size,
      maxMessages: MAX_MESSAGES,
      maxSize: MAX_STORAGE_SIZE,
      usagePercent: Math.round(
        (size / MAX_STORAGE_SIZE) * 100
      )
    };
  }




  health() {

    const stats = this.stats();

    return {
      status: "healthy",
      messages: stats.messages,
      storageUsed: stats.size,
      usagePercent: stats.usagePercent,
      duplicateProtection: true,
      quotaProtection: true,
      autoCleanup: true,
      imageSanitizer: true
    };

  }


  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

}

export const storageManager = new StorageManager();
