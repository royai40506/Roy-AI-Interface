import { createRoot } from "react-dom/client";
import { App as CapacitorApp } from "@capacitor/app";
import App from "./App";
import "./index.css";
import { AppProvider } from "./context/AppContext";

CapacitorApp.addListener("backButton", ({ canGoBack }) => {
  if (window.location.pathname !== "/") {
    if (canGoBack || window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  } else {
    CapacitorApp.exitApp();
  }
});

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
