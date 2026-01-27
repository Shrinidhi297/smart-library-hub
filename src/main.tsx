import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

const root = document.getElementById("root");

if (!root) {
    throw new Error("Root element not found");
}

try {
    createRoot(root).render(
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <App />
        </ClerkProvider>
    );
} catch (error) {
    console.error("Failed to render application:", error);
    root.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; color: #ef4444;">
      <h1>Application Error</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <p>Please fix the error and reload.</p>
    </div>
  `;
}
