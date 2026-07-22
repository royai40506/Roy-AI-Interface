import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Brain, FolderOpen, Settings } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const navItems = [
  { labelEN: 'Home',     labelHI: 'होम',      icon: Home,          route: '/' },
  { labelEN: 'Chat',     labelHI: 'चैट',       icon: MessageCircle, route: '/chat' },
  { labelEN: 'Memory',   labelHI: 'मेमोरी',    icon: Brain,         route: '/memory' },
  { labelEN: 'Files',    labelHI: 'फ़ाइलें',    icon: FolderOpen,    route: '/files' },
  { labelEN: 'Settings', labelHI: 'सेटिंग्स',  icon: Settings,      route: '/settings' },
];

export default function BottomNav() {
  const { language } = useAppContext();
  const [location] = useLocation();

  return (
    <nav
      className="flex-shrink-0 border-t border-border/30 bg-background/90 backdrop-blur-xl safe-bottom z-30"
      data-testid="bottom-nav"
    >
      <div className="flex items-stretch h-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.route === '/'
            ? location === '/'
            : location.startsWith(item.route);
          const label = language === 'en' ? item.labelEN : item.labelHI;

          return (
            <Link
              key={item.route}
              href={item.route}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative group"
              data-testid={`bottom-nav-${item.route.slice(1) || 'home'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground group-active:text-foreground'
                  }`}
                />
              </motion.div>

              <span
                className={`text-[9px] font-medium leading-none transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
