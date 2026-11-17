import { clsx, type ClassValue } from "clsx";
import type { Lang } from "@/lib/i18n";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string, lang: Lang): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-IQ" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 ? 0 : 1)} ${units[i]}`;
}

export function formatNum(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "ar" ? "ar-IQ" : "en-US").format(n);
}

export function pick<T extends Record<string, unknown>>(
  obj: T,
  arKey: keyof T,
  enKey: keyof T,
  lang: Lang
): string {
  const primary = lang === "ar" ? obj[arKey] : obj[enKey];
  const fallback = lang === "ar" ? obj[enKey] : obj[arKey];
  return String(primary || fallback || "");
}
