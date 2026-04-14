import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          containerStyle={{ top: 88 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(30, 41, 59, 0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "#f1f5f9",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "12px",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#f1f5f9" },
              style: { borderLeft: "3px solid #22c55e" },
            },
            error: {
              duration: 4000,
              iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" },
              style: { borderLeft: "3px solid #ef4444" },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
