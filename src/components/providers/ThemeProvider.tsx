"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "@/lib/theme";

type ColorMode = "light" | "dark";

interface ThemeContextType {
  mode: ColorMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorMode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ColorMode | null;
    if (saved === "dark" || saved === "light") setMode(saved);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
