import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachedFile?: string;
}

export type Language = 'en' | 'hi' | 'mr';

export interface MemoryEntry {
  id: string;
  content: string;
  category: 'personal' | 'preference' | 'fact' | 'conversation';
  createdAt: Date;
  source: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  preview?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  memories: MemoryEntry[];
  addMemory: (entry: Omit<MemoryEntry, 'id' | 'createdAt'>) => void;
  deleteMemory: (id: string) => void;
  files: UploadedFile[];
  addFile: (file: Omit<UploadedFile, 'id' | 'uploadedAt'>) => void;
  deleteFile: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const defaultColors = {
  blue: '239 84% 67%',
};

const defaultContext: AppContextType = {
  language: 'en',
  setLanguage: () => {},
  accentColor: defaultColors.blue,
  setAccentColor: () => {},
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
  memories: [],
  addMemory: () => {},
  deleteMemory: () => {},
  files: [],
  addFile: () => {},
  deleteFile: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

const getInitialMessages = (lang: Language): Message[] => [
  {
    id: 'welcome-1',
    role: 'assistant',
    content:
      lang === 'en'
        ? "Hi there. I'm Roy. How can I help you today?"
        : lang === 'hi'
        ? 'नमस्ते। मैं रॉय हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?'
        : 'नमस्कार। मी रॉय आहे। आज मी तुम्हाला कशी मदत करू शकतो?',
    timestamp: new Date(),
  },
];

const getInitialMemories = (): MemoryEntry[] => [
  {
    id: 'mem-1',
    content: 'User prefers concise answers',
    category: 'preference',
    source: 'Chat on July 20',
    createdAt: new Date('2024-07-20'),
  },
  {
    id: 'mem-2',
    content: 'User is learning React and TypeScript',
    category: 'personal',
    source: 'Chat on July 19',
    createdAt: new Date('2024-07-19'),
  },
  {
    id: 'mem-3',
    content: "User's name is not yet known",
    category: 'personal',
    source: 'Auto-detected',
    createdAt: new Date(),
  },
  {
    id: 'mem-4',
    content: 'Prefers dark mode always',
    category: 'preference',
    source: 'Settings',
    createdAt: new Date(),
  },
];

const getInitialFiles = (): UploadedFile[] => [
  {
    id: 'file-1',
    name: 'project-brief.pdf',
    size: 245000,
    type: 'application/pdf',
    uploadedAt: new Date('2024-07-18'),
  },
  {
    id: 'file-2',
    name: 'design-notes.txt',
    size: 4200,
    type: 'text/plain',
    uploadedAt: new Date('2024-07-19'),
  },
  {
    id: 'file-3',
    name: 'logo-draft.png',
    size: 89000,
    type: 'image/png',
    uploadedAt: new Date('2024-07-20'),
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('roy_language') as Language) || 'en';
  });

  const [accentColor, setAccentColorState] = useState<string>(() => {
    return localStorage.getItem('roy_accent') || defaultColors.blue;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('roy_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: Message & { timestamp: string }) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      } catch {
        return getInitialMessages('en');
      }
    }
    return getInitialMessages('en');
  });

  const [memories, setMemories] = useState<MemoryEntry[]>(() => {
    const saved = localStorage.getItem('roy_memories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: MemoryEntry & { createdAt: string }) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        }));
      } catch {
        return getInitialMemories();
      }
    }
    return getInitialMemories();
  });

  const [files, setFiles] = useState<UploadedFile[]>(() => {
    const saved = localStorage.getItem('roy_files');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((f: UploadedFile & { uploadedAt: string }) => ({
          ...f,
          uploadedAt: new Date(f.uploadedAt),
        }));
      } catch {
        return getInitialFiles();
      }
    }
    return getInitialFiles();
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply accent color to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--ring', accentColor);
    localStorage.setItem('roy_accent', accentColor);
  }, [accentColor]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('roy_language', lang);
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
  };

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages((prev) => {
      const newMessages = [
        ...prev,
        { ...msg, id: Date.now().toString(), timestamp: new Date() },
      ];
      localStorage.setItem('roy_messages', JSON.stringify(newMessages));
      return newMessages;
    });
  };

  const clearMessages = () => {
    const initial = getInitialMessages(language);
    setMessages(initial);
    localStorage.setItem('roy_messages', JSON.stringify(initial));
  };

  const addMemory = (entry: Omit<MemoryEntry, 'id' | 'createdAt'>) => {
    setMemories((prev) => {
      const newMemories = [
        ...prev,
        { ...entry, id: `mem-${Date.now()}`, createdAt: new Date() },
      ];
      localStorage.setItem('roy_memories', JSON.stringify(newMemories));
      return newMemories;
    });
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => {
      const newMemories = prev.filter((m) => m.id !== id);
      localStorage.setItem('roy_memories', JSON.stringify(newMemories));
      return newMemories;
    });
  };

  const addFile = (file: Omit<UploadedFile, 'id' | 'uploadedAt'>) => {
    setFiles((prev) => {
      const newFiles = [
        ...prev,
        { ...file, id: `file-${Date.now()}`, uploadedAt: new Date() },
      ];
      localStorage.setItem('roy_files', JSON.stringify(newFiles));
      return newFiles;
    });
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => {
      const newFiles = prev.filter((f) => f.id !== id);
      localStorage.setItem('roy_files', JSON.stringify(newFiles));
      return newFiles;
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        accentColor,
        setAccentColor,
        messages,
        addMessage,
        clearMessages,
        memories,
        addMemory,
        deleteMemory,
        files,
        addFile,
        deleteFile,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
