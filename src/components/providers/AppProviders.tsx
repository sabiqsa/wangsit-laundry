"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { AppThemeProvider } from "./ThemeProvider";
import { EmotionRegistry } from "./EmotionRegistry";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EmotionRegistry>
        <AppThemeProvider>{children}</AppThemeProvider>
      </EmotionRegistry>
    </SessionProvider>
  );
}
