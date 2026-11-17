"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLangStore } from "@/lib/store";
import { dirOf } from "@/lib/i18n";
import { useThemeStore } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const lang = useLangStore((s) => s.lang);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dirOf(lang);
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (sessionStorage.getItem("oc-tracked")) return;
    sessionStorage.setItem("oc-tracked", "1");
    fetch("/api/track", { method: "POST" }).catch(() => {});
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
