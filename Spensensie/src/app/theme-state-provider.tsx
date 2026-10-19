"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppStateProvider } from "@/lib/store";

export function ThemeStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppStateProvider>{children}</AppStateProvider>
    </ThemeProvider>
  );
}