import { Menu, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function ChatHeader() {
  const { language, setLanguage, setSidebarOpen } = useAppContext();

  return (
    <header className="flex-shrink-0 h-16 px-4 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md z-10 safe-top">
      <button
        onClick={() => setSidebarOpen(true)}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors text-foreground"
        data-testid="button-menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_12px_rgba(var(--primary),0.15)]">
          <span className="text-primary font-bold text-sm">R</span>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold leading-tight text-foreground">Roy AI</h1>
          <span className="text-[10px] text-green-500 font-medium">
            {language === 'en' ? 'Online' : 'ऑनलाइन'}
          </span>
        </div>
      </div>
      
      <button
        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        className="h-9 px-3 rounded-full bg-card/80 border border-border/50 hover:bg-card transition-colors flex items-center gap-1.5 text-xs font-medium text-foreground"
        data-testid="button-language-toggle"
      >
        {language === 'en' ? 'EN' : 'हिं'}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
    </header>
  );
}
