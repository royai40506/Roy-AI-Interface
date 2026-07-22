import { AppProvider } from '@/context/AppContext';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import MemoryPage from '@/pages/MemoryPage';
import FilesPage from '@/pages/FilesPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFound from '@/pages/not-found';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/memory" component={MemoryPage} />
      <Route path="/files" component={FilesPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <div className="h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden">
              <Sidebar />
              <div className="flex-1 overflow-hidden flex flex-col">
                <Router />
              </div>
              <BottomNav />
            </div>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
