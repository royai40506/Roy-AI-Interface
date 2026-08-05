import { storageManager } from "../storage";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachedFile?: string;
}

export type Language = 'en' | 'hi' | 'mr';
export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  previewUrl?: string;
}

export interface MemoryEntry {
  id: string;
  content: string;
  category: 'personal' | 'preference' | 'fact' | 'conversation';
  source: string;
  createdAt: Date;
}


interface AppContextType {
  orbState: OrbState;
  setOrbState: (state: OrbState) => void;
  audioLevel: number;
  setAudioLevel: (level: number) => void;
  royAlignment: unknown;
  setRoyAlignment: (alignment: unknown) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  files: UploadedFile[];
  addFile: (file: Omit<UploadedFile,'id'|'uploadedAt'>) => void;
  deleteFile: (id:string)=>void;

  memories: MemoryEntry[];
  addMemory: (memory: Omit<MemoryEntry,'id'|'createdAt'>) => void;
  deleteMemory: (id:string)=>void;

  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

const defaultColors = {
  blue: '239 84% 67%',    // #6366f1
};

const defaultContext: AppContextType = {
  orbState: 'idle',
  setOrbState: () => {},
  audioLevel: 0,
  setAudioLevel: () => {},
  royAlignment: null,
  setRoyAlignment: () => {},
  language: 'en',
  setLanguage: () => {},
  accentColor: defaultColors.blue,
  setAccentColor: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},

  files: [],
  addFile: () => {},
  deleteFile: () => {},

  memories: [],
  addMemory: () => {},
  deleteMemory: () => {},

  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

const getInitialMessages = (lang: Language): Message[] => [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: lang === 'en' 
      ? "Hi there. I'm Roy. How can I help you today?" 
      : "नमस्ते। मैं रॉय हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    timestamp: new Date(),
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('roy_language') as Language) || 'en';
  });
  
  const [accentColor, setAccentColorState] = useState<string>(() => {
    return localStorage.getItem('roy_accent') || defaultColors.blue;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [royAlignment, setRoyAlignment] = useState<unknown>(null);

const [files, setFiles] = useState<UploadedFile[]>(() => {
  const saved = localStorage.getItem('roy_files');
  if (!saved) return [];
  try {
    return JSON.parse(saved).map((f:any)=>({...f, uploadedAt:new Date(f.uploadedAt)}));
  } catch {
    return [];
  }
});
const [memories, setMemories] = useState<MemoryEntry[]>(() => {
  const saved = localStorage.getItem('roy_memories');
  if (!saved) return [];
  try {
    return JSON.parse(saved).map((m:any)=>({...m, createdAt:new Date(m.createdAt)}));
  } catch {
    return [];
  }
});

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedResult = storageManager.load();
    const saved = savedResult.success ? JSON.stringify(savedResult.data) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        return getInitialMessages(language);
      }
    }
    return getInitialMessages(language);
  });

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

  
const addFile = (file: Omit<UploadedFile,'id'|'uploadedAt'>) => {
  setFiles(prev => [...prev,{
    ...file,
    id: Date.now().toString(),
    uploadedAt:new Date()
  }]);
};

const deleteFile = (id:string)=>{
  setFiles(prev=>prev.filter(f=>f.id!==id));
};

const addMemory = (memory: Omit<MemoryEntry,'id'|'createdAt'>) => {
  setMemories(prev => [...prev,{
    ...memory,
    id: Date.now().toString(),
    createdAt:new Date()
  }]);
};

const deleteMemory = (id:string)=>{
  setMemories(prev=>prev.filter(m=>m.id!==id));
};

const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => {
      const newMessages = [
        ...prev,
        { ...msg, id: Date.now().toString(), timestamp: new Date() }
      ];

      const sanitizedMessages = newMessages.slice(-30);

      localStorage.setItem(
        'roy_messages',
        JSON.stringify(sanitizedMessages)
      );

      return sanitizedMessages;
    });
  };

const clearMessages = () => {
    const initial = getInitialMessages(language);
    setMessages(initial);
    storageManager.save(initial as any);
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      accentColor,
      setAccentColor,
      sidebarOpen,
      setSidebarOpen,

      orbState,
      setOrbState,
    audioLevel,
    setAudioLevel,
                                       royAlignment,
                                       setRoyAlignment,

      files,
      addFile,
      deleteFile,

      memories,
      addMemory,
      deleteMemory,

      messages,
      addMessage,
      clearMessages
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
