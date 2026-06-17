import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <AuthProvider>

      <ThemeProvider>

        <BrowserRouter>

          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#1E2535",
                color: "#F1F5F9",
                border: "1px solid #2D3748",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#1E2535",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#1E2535",
                },
              },
            }}
          />

        </BrowserRouter>

      </ThemeProvider>

    </AuthProvider>

  </React.StrictMode>
);