"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dictionaries, dirOf, type DictKey, type Lang } from "@/lib/i18n";

type LangState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "ar",
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "ar" ? "en" : "ar" }),
    }),
    { name: "oc-lang" }
  )
);

export function useT() {
  const lang = useLangStore((s) => s.lang);
  const dict = dictionaries[lang];
  const t = (key: DictKey) => dict[key] ?? key;
  return { t, lang, dir: dirOf(lang) as "rtl" | "ltr" };
}

type ThemeState = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
    }),
    { name: "oc-theme" }
  )
);
