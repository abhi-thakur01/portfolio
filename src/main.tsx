import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Performance observer for Core Web Vitals (logs to console in dev, can send to analytics)
if (typeof window !== "undefined" && "PerformanceObserver" in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log LCP, CLS, etc in dev only
        if (import.meta.env.DEV) {
          console.log(`[Perf] ${entry.name}:`, entry);
        }
      }
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true } as any);
    observer.observe({ type: "layout-shift", buffered: true } as any);
  } catch {}
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
