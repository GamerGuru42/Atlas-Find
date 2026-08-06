"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{
        background: "transparent",
        border: "none",
        color: "var(--text-secondary)",
        cursor: "pointer",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        transition: "all 0.2s ease"
      }}
      title="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon size={20} strokeWidth={2.5} />
      ) : (
        <Sun size={20} strokeWidth={2.5} />
      )}
    </button>
  );
}
