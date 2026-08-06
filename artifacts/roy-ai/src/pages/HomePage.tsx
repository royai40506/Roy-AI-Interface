import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Menu, MessageCircle, Brain, FolderOpen, Settings, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import RoyAvatarFX from "@/components/RoyAvatarFX";
import royAvatar from '/avatar/roy-avatar-v2.png';
import { toast } from "@/hooks/use-toast";
import { checkForUpdates } from "@/lib/update-api";
import { startUpdate } from "@/plugins/UpdateManager";

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

export default function HomePage() {
  const { language, setLanguage, setSidebarOpen, messages, orbState, setOrbState, audioLevel, royAlignment } = useAppContext();
  const [, navigate] = useLocation();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
const [updateInfo, setUpdateInfo] = useState<any>(null);
const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  
  const SpeechRecognitionAPI =
    typeof window !== "undefined"
      ? ((window as any).SpeechRecognition ||
         (window as any).webkitSpeechRecognition)
      : null;

const speechSupported = useMemo(() => {
    return typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  }, []);


  useEffect(() => {
    (async () => {
      const info = await checkForUpdates();

      if (info?.updateAvailable) {
        console.log("ROY UPDATE AVAILABLE:", info.latestVersion);

        setUpdateInfo(info);
        setShowUpdateDialog(true);

        toast({
          title: "Update Available",
          description: `New version ${info.latestVersion} is available.`,
        });
      }
    })();
  }, []);


  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'en') {
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    } else {
      if (hour < 12) return 'सुप्रभात';
      if (hour < 18) return 'शुभ दोपहर';
      return 'शुभ संध्या';
    }
  };

  // Get current date
  const currentDate = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'hi-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Quick actions
  const quickActions = [
    {
      labelEN: 'Start Chat',
      labelHI: 'चैट शुरू करें',
      icon: MessageCircle,
      route: '/chat',
    },
    {
      labelEN: 'My Memory',
      labelHI: 'मेरी मेमोरी',
      icon: Brain,
      route: '/memory',
    },
    {
      labelEN: 'My Files',
      labelHI: 'मेरी फ़ाइलें',
      icon: FolderOpen,
      route: '/files',
    },
    {
      labelEN: 'Settings',
      labelHI: 'सेटिंग्स',
      icon: Settings,
      route: '/settings',
    },
  ];

  // Recent messages (last 3 assistant messages)
  const recentMessages = messages
    .filter(m => m.role === 'assistant')
    .slice(-3)
    .reverse();


  const startVoiceSession = async () => {
    if (isVoiceActive) return;

    window.dispatchEvent(new CustomEvent("roy-stop-audio"));

    if (!speechSupported || !SpeechRecognitionAPI) {
      toast({
        title: "Voice Unsupported",
        description: "Speech Recognition is not available in this browser.",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch {
      toast({
        title: "Microphone Permission",
        description: "Please allow microphone access.",
      });
      return;
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.lang = language === "en" ? "en-US" : "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsVoiceActive(true);
      setOrbState("listening");
    };

    recognition.onerror = () => {
      setIsVoiceActive(false);
      setOrbState("idle");
      toast({
        title: "Voice Error",
        description: "Unable to start microphone.",
      });
    };

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;

      console.log("ROY VOICE:", spokenText);

      toast({
        title: "Roy Heard",
        description: spokenText,
      });

      window.dispatchEvent(
        new CustomEvent("roy-voice-input", {
          detail: spokenText,
        })
      );

      recognition.stop();
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
      setOrbState("idle");
    };

    recognition.start();
  };

  useEffect(() => {
    const handler = () => {
      startVoiceSession();
    };

    window.addEventListener("roy-start-voice", handler);

    return () => {
      window.removeEventListener("roy-start-voice", handler);
    };
  }, []);

  // Cycle orb states on tap
  const handleOrbClick = () => {
    startVoiceSession();

    const states: OrbState[] = ['idle', 'listening', 'thinking', 'speaking'];
    const currentIndex = states.indexOf(orbState);
    setOrbState(states[(currentIndex + 1) % states.length]);
  };

  const t = {
    tapOrb: language === 'en' ? 'Tap orb to chat' : 'चैट के लिए ऑर्ब टैप करें',
    recentActivity: language === 'en' ? 'Recent Activity' : 'हाल की गतिविधि',
  };

  return (
    
<div className="flex flex-col h-full bg-background overflow-hidden relative">

      {showUpdateDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[340px] rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-2">🚀 Update Available</h2>

            <p className="text-sm opacity-80 mb-4">
              Latest Version: {updateInfo?.latestVersion ?? "Unknown"}
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                onClick={() =>
                  startUpdate(
                    updateInfo?.downloadUrl ||
                    "https://github.com/royai40506/Roy-AI-Interface/releases"
                  )
                }
              >
                Update Now
              </button>

              <button
                className="flex-1 rounded-lg border px-4 py-2"
                onClick={() => setShowUpdateDialog(false)}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Header */}
      <header className="flex-shrink-0 h-16 px-4 flex items-center justify-between border-b border-border/30 bg-background/80 backdrop-blur-md z-10 safe-top">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors text-foreground"
          data-testid="button-menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold tracking-tight text-foreground">Roy AI</h1>

        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : language === 'hi' ? 'mr' : 'en')}
          className="h-9 px-3 rounded-full bg-card/80 border border-border/50 hover:bg-card transition-colors flex items-center gap-1.5 text-sm font-medium text-foreground"
          data-testid="button-language-toggle"
        >
          {language === 'en' ? 'EN' : language === 'hi' ? 'हिं' : 'मरा'}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-8">
        {/* Hero Section - Centered Orb */}
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 pt-8 relative z-10">
          <motion.div className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [1,1.03,1], y:[0,-8,0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <RoyAvatarFX image={royAvatar} state={orbState} audioLevel={audioLevel} alignment={royAlignment} onClick={handleOrbClick} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mt-8 space-y-2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {getGreeting()}
            </h2>
            <p className="text-sm text-muted-foreground">{currentDate}</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 mb-8"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const label = language === 'en' ? action.labelEN : action.labelHI;

            return (
              <motion.div
                key={action.route}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
              >
                <Link
                  href={action.route}
                  className="flex flex-col items-center justify-center gap-3 h-24 bg-card/80 backdrop-blur border border-border/50 rounded-2xl hover:bg-card hover:scale-105 active:scale-95 transition-all shadow-sm"
                  data-testid={`button-quick-${action.route.slice(1)}`}
                >
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Activity */}
        {recentMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="px-4 space-y-3"
          >
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
              {t.recentActivity}
            </h3>
            <div className="space-y-2">
              {recentMessages.map((msg, index) => (
                <Link
                  key={msg.id}
                  href="/chat"
                  className="flex items-start gap-3 p-3 bg-card/50 border border-border/30 rounded-xl hover:bg-card/80 hover:border-border/50 transition-all group"
                  data-testid={`link-recent-message-${index}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">R</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/90 line-clamp-2 leading-relaxed">
                      {msg.content}
                    </p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'hi-IN', {
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(msg.timestamp)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex items-center justify-center gap-2 mt-8 text-xs text-muted-foreground/60"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.div>
          <span>{t.tapOrb}</span>
        </motion.div>
      </main>
    </div>
  );
}
