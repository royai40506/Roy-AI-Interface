import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageCircle, MessageSquare, Brain, FolderOpen, Settings, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const navItems = [
  { labelEN: 'Home', labelHI: 'होम', icon: Home, path: '/' },
  { labelEN: 'Chat', labelHI: 'चैट', icon: MessageSquare, path: '/chat' },
  { labelEN: 'Memory', labelHI: 'मेमोरी', icon: Brain, path: '/memory' },
  { labelEN: 'Files', labelHI: 'फ़ाइलें', icon: FolderOpen, path: '/files' },
  { labelEN: 'Market', labelHI: 'मार्केट', icon: FolderOpen, path: '/market' },
  { labelEN: 'Settings', labelHI: 'सेटिंग्स', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, language, setLanguage } = useAppContext();
  const [location] = useLocation();

  // Close sidebar on route change (mobile behavior)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location, setSidebarOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
            data-testid="sidebar-backdrop"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-gradient-to-b from-[#0d0d18] to-[#12121a] border-r border-primary/15 shadow-[4px_0_40px_rgba(99,102,241,0.08)] z-50 flex flex-col"
            data-testid="sidebar"
          >
            {/* Header */}
            <div className="flex-shrink-0 p-6 pb-4 border-b border-border/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <span className="text-primary font-bold text-xl">R</span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-base font-bold text-foreground tracking-tight">Roy AI</h2>
                    <p className="text-xs text-muted-foreground">Personal AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                  data-testid="button-close-sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-xs font-medium text-green-500">Online</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 overflow-y-auto">
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  const label = language === 'en' ? item.labelEN : item.labelHI;

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <Link
                        href={item.path}
                        className={`
                          relative flex items-center gap-3 h-[52px] px-4 rounded-xl transition-all
                          ${isActive 
                            ? 'bg-primary/10 text-primary font-medium shadow-[inset_3px_0_0_0_hsl(var(--primary))]' 
                            : 'text-muted-foreground hover:bg-white/4 hover:text-foreground'
                          }
                        `}
                        data-testid={`link-nav-${item.path.slice(1) || 'home'}`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-[15px]">{label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-border/30 space-y-3">
              {/* Language Toggle */}
              <div className="flex items-center gap-2 bg-card/50 border border-border/30 rounded-xl p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all ${
                    language === 'en'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid="button-lang-en"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all ${
                    language === 'hi'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid="button-lang-hi"
                >
                  हिंदी
                </button>
              </div>

              {/* Version */}
              <div className="text-center text-[10px] text-muted-foreground/60 font-medium tracking-wide">
                Roy AI v1.0.0
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
