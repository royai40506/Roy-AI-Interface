export interface ExtractedMemory {

  category: string;

  key: string;

  value: string;

}

export class MemoryExtractor {

  extract(text: string): ExtractedMemory | null {

    const input = text.trim();

    let m =
      input.match(/^my name is (.+)$/i);

    if (m) {

      return {

        category: "personal",

        key: "name",

        value: m[1].trim()

      };

    }

    m =
      input.match(/^i am (.+)$/i);

    if (m) {

      return {

        category: "personal",

        key: "name",

        value: m[1].trim()

      };

    }

    m =
      input.match(/^call me (.+)$/i);

    if (m) {

      return {

        category: "personal",

        key: "name",

        value: m[1].trim()

      };

    }

    return null;

  }

}

export const memoryExtractor =
  new MemoryExtractor();
