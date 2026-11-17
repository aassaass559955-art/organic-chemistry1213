"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Atom,
  Bell,
  BookOpen,
  ChevronDown,
  FlaskConical,
  GraduationCap,
  Home,
  Languages,
  LayoutDashboard,
  Library,
  Mail,
  Menu,
  Moon,
  Newspaper,
  Orbit,
  Sparkles,
  Sun,
  Users,
  FileText,
  X,
  Workflow,
  Bot,
} from "lucide-react";
import { useT, useLangStore, useThemeStore } from "@/lib/store";
import { cn, formatDate, pick } from "@/lib/utils";
import type { DictKey } from "@/lib/i18n";

type NavLink = { href: string; key: DictKey; icon: typeof Home };

const primaryLinks: NavLink[] = [
  { href: "/", key: "navHome", icon: Home },
  { href: "/researches", key: "navResearches", icon: FlaskConical },
  { href: "/theses", key: "navTheses", icon: GraduationCap },
  { href: "/reactions", key: "navReactions", icon: Workflow },
  { href: "/topics", key: "navTopics", icon: Atom },
  { href: "/library", key: "navLibrary", icon: Library },
  { href: "/news", key: "navNews", icon: Newspaper },
];

const moreLinks: NavLink[] = [
  { href: "/studies", key: "navStudies", icon: BookOpen },
  { href: "/articles", key: "navArticles", icon: FileText },
  { href: "/structures", key: "navStructures", icon: Orbit },
  { href: "/assistant", key: "navAssistant", icon: Bot },
  { href: "/about", key: "navAbout", icon: Users },
  { href: "/contact", key: "navContact", icon: Mail },
];

type Notification = {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  createdAt: string;
};

function LangToggle() {
  const { t } = useT();
  const toggleLang = useLangStore((s) => s.toggleLang);
  return (
    <button
      onClick={toggleLang}
      className="chip hover:border-primary/60 transition-colors cursor-pointer"
      aria-label="Switch language"
    >
      <Languages className="h-3.5 w-3.5 text-primary" />
      <span>{t("language")}</span>
    </button>
  );
}

function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full border border-line bg-surface p-2 transition hover:border-primary/60 cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-primary" />
      ) : (
        <Moon className="h-4 w-4 text-accent" />
      )}
    </button>
  );
}

function NotificationsBell({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang } = useT();
  const { data } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => (await fetch("/api/notifications")).json(),
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className={cn(
          "relative rounded-full border border-line bg-surface p-2 transition hover:border-primary/60 cursor-pointer",
          mobile && "p-2.5"
        )}
      >
        <Bell className="h-4 w-4 text-muted" />
        {data && data.length > 0 && (
          <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-ink">
            {data.length}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="glass-strong absolute end-0 top-12 z-50 w-80 overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="border-b border-line px-4 py-3 text-sm font-bold">{t("adminNotifications")}</div>
            <div className="max-h-80 overflow-y-auto">
              {data?.map((n) => (
                <div key={n.id} className="border-b border-line/50 px-4 py-3 last:border-0">
                  <p className="text-sm font-semibold text-primary">{pick(n, "titleAr", "titleEn", lang)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{pick(n, "bodyAr", "bodyEn", lang)}</p>
                  <p className="mt-1 text-[10px] text-muted/70">{formatDate(n.createdAt, lang)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { t } = useT();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass py-2 shadow-lg shadow-black/10" : "bg-transparent py-4"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:rotate-12">
            <Atom className="h-6 w-6 text-white" />
            <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition group-hover:opacity-100" />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-lg font-bold tracking-tight">
              <span className="text-gradient">{t("siteName")}</span>
            </span>
            <span className="block text-[10px] font-medium tracking-widest text-muted">
              {t("researcherName")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === l.href
                  ? "bg-primary/15 text-primary"
                  : "text-muted hover:bg-surface hover:text-foreground"
              )}
            >
              {t(l.key)}
            </Link>
          ))}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground cursor-pointer",
                moreOpen && "bg-surface text-foreground"
              )}
            >
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", moreOpen && "rotate-180")} />
              {moreOpen ? "—" : "··"}
              المزيد / More
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="glass-strong absolute end-0 top-12 z-50 w-64 rounded-2xl p-2 shadow-2xl"
                >
                  {moreLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        pathname === l.href ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface hover:text-foreground"
                      )}
                    >
                      <l.icon className="h-4 w-4" />
                      {t(l.key)}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {mounted && (
            <>
              <NotificationsBell />
              <ThemeToggle />
              <LangToggle />
            </>
          )}
          <Link href="/assistant" className="btn-primary !px-4 !py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            {t("navAssistant")}
          </Link>
          {isAdmin && (
            <Link href="/admin" className="btn-ghost !px-4 !py-2 text-sm">
              <LayoutDashboard className="h-4 w-4" />
              {t("adminDashboard")}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          {mounted && <LangToggle />}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-full border border-line bg-surface p-2.5 cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[64px] z-40 bg-background/95 backdrop-blur-2xl xl:hidden"
          >
            <div className="grid gap-1 overflow-y-auto p-6 pb-24">
              {[...primaryLinks, ...moreLinks].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl px-4 py-3.5 text-base font-medium transition",
                      pathname === l.href ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface"
                    )}
                  >
                    <l.icon className="h-5 w-5" />
                    {t(l.key)}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 flex items-center gap-3 px-2">
                {mounted && (
                  <>
                    <NotificationsBell mobile />
                    <ThemeToggle />
                  </>
                )}
                <Link href="/admin" className="btn-ghost !py-2.5 text-sm">
                  <LayoutDashboard className="h-4 w-4" />
                  {t("adminDashboard")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
