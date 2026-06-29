"use client";

import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <Tooltip title={mode === "dark" ? "Mode Terang" : "Mode Gelap"}>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
