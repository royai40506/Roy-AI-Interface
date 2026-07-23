import { Route, Switch } from "wouter";

import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";
import MemoryPage from "@/pages/MemoryPage";
import FilesPage from "@/pages/FilesPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/memory" component={MemoryPage} />
      <Route path="/files" component={FilesPage} />
      <Route path="/settings" component={SettingsPage} />
    </Switch>
  );
}
