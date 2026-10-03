"use client";

import { createContext, useContext } from "react";
import type { SupportedLocale } from "./locale-config";
import type { LocaleData } from "./type";

export const LocaleContext = createContext<{ lang: SupportedLocale; locale: LocaleData } | null>(null);

export function useAppLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleContext is missing");
  return context;
}
