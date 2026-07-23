import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachedFile?: string;
}

export type Language = 'en' | 'hi';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

const defaultColors = {
  blue: '239 84% 67%',    // #6366f1
};

const defaultContext: AppContextType = {
  language: 'en',
  setLanguage: () => {},
  accentColor: defaultColors.blue,
  setAccentColor: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},
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

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('roy_messages');
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

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => {
      const newMessages = [
        ...prev, 
        { ...msg, id: Date.now().toString(), timestamp: new Date() }
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

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      accentColor,
      setAccentColor,
      sidebarOpen,
      setSidebarOpen,
      messages,
      addMessage,
      clearMessages
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
