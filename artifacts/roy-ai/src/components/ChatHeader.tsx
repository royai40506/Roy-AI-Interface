import React from 'react';
import { Link } from 'wouter';
import { Settings, Sparkles } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function ChatHeader() {
  const { language } = useAppContext();

  return (
    <header className="flex-shrink-0 h-16 px-4 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md z-10 safe-top">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
          <Sparkles className="w-4 h-4 text-primary" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-semibold leading-tight flex items-center gap-2 text-foreground">
            Roy AI
          </h1>
          <span className="text-xs text-muted-foreground">
            {language === 'en' ? 'Online' : 'ऑनलाइन'} • {language === 'en' ? 'English' : 'हिंदी'}
          </span>
        </div>
      </div>
      
      <Link href="/settings" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
        <Settings className="w-5 h-5" />
      </Link>
    </header>
  );
}
