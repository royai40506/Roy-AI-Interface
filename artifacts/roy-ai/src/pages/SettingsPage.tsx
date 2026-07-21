import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Check, Trash2, Heart, Sparkles, MonitorSmartphone } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";

const ACCENT_COLORS = [
  { name: 'Blue', value: '239 84% 67%' }, // indigo-500
  { name: 'Violet', value: '270 76% 53%' }, // violet-500
  { name: 'Green', value: '142 71% 45%' }, // green-500
  { name: 'Orange', value: '24 98% 50%' }, // orange-500
  { name: 'Red', value: '0 84% 60%' }, // red-500
];

export default function SettingsPage() {
  const { language, setLanguage, accentColor, setAccentColor, clearMessages } = useAppContext();
  const [cleared, setCleared] = useState(false);

  const t = {
    title: language === 'en' ? 'Settings' : 'सेटिंग्स',
    language: 'Language / भाषा',
    appearance: language === 'en' ? 'Appearance' : 'दिखावट',
    theme: language === 'en' ? 'Theme' : 'थीम',
    dark: language === 'en' ? 'Dark' : 'डार्क',
    accent: language === 'en' ? 'Accent Color' : 'मुख्य रंग',
    about: language === 'en' ? 'About Roy AI' : 'Roy AI के बारे में',
    version: language === 'en' ? 'Version' : 'संस्करण',
    chat: language === 'en' ? 'Chat' : 'चैट',
    clearChat: language === 'en' ? 'Clear Chat History' : 'चैट इतिहास मिटाएं',
    clearConfirmTitle: language === 'en' ? 'Clear Chat?' : 'चैट मिटाएं?',
    clearConfirmDesc: language === 'en' 
      ? 'This will delete all messages. This action cannot be undone.' 
      : 'यह सभी संदेशों को हटा देगा। इस क्रिया को पूर्ववत नहीं किया जा सकता है।',
    cancel: language === 'en' ? 'Cancel' : 'रद्द करें',
    clear: language === 'en' ? 'Clear' : 'मिटाएं',
    madeWith: language === 'en' ? 'Made with' : 'से निर्मित',
    inIndia: language === 'en' ? 'in India' : 'भारत में'
  };

  const handleClearChat = () => {
    clearMessages();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <header className="flex-shrink-0 h-16 px-2 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-md z-10 safe-top">
        <Link href="/" className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold ml-2">{t.title}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-10">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Language Section */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-primary tracking-widest uppercase px-1">{t.language}</h2>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/50">
              <button 
                onClick={() => setLanguage('en')}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-[15px] font-medium text-foreground">English</span>
                {language === 'en' && <Check className="w-5 h-5 text-primary" />}
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-[15px] font-medium text-foreground">हिंदी</span>
                {language === 'hi' && <Check className="w-5 h-5 text-primary" />}
              </button>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-primary tracking-widest uppercase px-1">{t.appearance}</h2>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/50">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <MonitorSmartphone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[15px] font-medium text-foreground">{t.theme}</span>
                </div>
                <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-full">
                  <div className="w-3 h-3 rounded-full bg-foreground"></div>
                  <span className="text-xs font-medium">{t.dark}</span>
                  <Check className="w-3.5 h-3.5 text-foreground ml-1" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] font-medium text-foreground">{t.accent}</span>
                <div className="flex items-center gap-2">
                  {ACCENT_COLORS.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setAccentColor(color.value)}
                      className="w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center"
                      style={{ 
                        backgroundColor: `hsl(${color.value})`,
                        borderColor: accentColor === color.value ? 'white' : 'transparent',
                        transform: accentColor === color.value ? 'scale(1.1)' : 'scale(1)'
                      }}
                      aria-label={`Select ${color.name} accent`}
                    >
                      {accentColor === color.value && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Chat Section */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-primary tracking-widest uppercase px-1">{t.chat}</h2>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left text-destructive">
                    <Trash2 className="w-5 h-5" />
                    <span className="text-[15px] font-medium">{cleared ? (language === 'en' ? 'Cleared!' : 'मिटा दिया!') : t.clearChat}</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border sm:max-w-md w-[90vw] rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">{t.clearConfirmTitle}</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      {t.clearConfirmDesc}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6 flex-row justify-end gap-3 sm:gap-3">
                    <AlertDialogCancel className="mt-0 border-border bg-background hover:bg-muted text-foreground rounded-xl w-auto">{t.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl w-auto">
                      {t.clear}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>

          {/* About Section */}
          <section className="space-y-3 pt-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(var(--primary),0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                <Sparkles className="w-8 h-8 text-primary relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight mb-1">Roy AI</h3>
              <p className="text-sm text-muted-foreground mb-6">Powered by intelligence</p>
              
              <div className="bg-card/50 border border-border/30 rounded-full px-4 py-1.5 text-xs text-muted-foreground font-medium mb-8">
                {t.version} 1.0.0
              </div>
              
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {t.madeWith} <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-0.5" /> {t.inIndia}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
