"use client";

import React, { createContext, useContext } from "react";
import { useAIChat } from "./useAIChat";

const AIChatContext = createContext<ReturnType<typeof useAIChat> | null>(null);

export function AIChatProvider({ children }: { children: React.ReactNode }) {
  const value = useAIChat();

  return (
    <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>
  );
}

export function useAIChatContext() {
  const ctx = useContext(AIChatContext);
  if (!ctx) {
    throw new Error("useAIChatContext must be used inside AIChatProvider");
  }
  return ctx;
}
