import { Route, Switch } from "wouter";

import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/chat" component={ChatPage} />
    </Switch>
  );
}
