export interface MemoryItem {
  id: string;
  category: string;
  key: string;
  value: string;

  createdAt: number;
  updatedAt: number;

  accessCount: number;
  lastAccessed: number;

  pinned?: boolean;
  importance?: number;

  // Vector Memory
  vector?: number[];
  embeddingModel?: string;
}

export interface MemorySearchResult {
  found: boolean;
  memory?: MemoryItem;
}

export interface MemoryStats {
  total: number;
  pinned: number;
}
