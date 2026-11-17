"use client";

import Link from "next/link";
import { Atom, Bot, GraduationCap, LayoutDashboard, Mail, User, Workflow } from "lucide-react";
import { useT } from "@/lib/store";

export function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();

  const sections = [
    { href: "/researches", label: t("navResearches") },
    { href: "/studies", label: t("navStudies") },
    { href: "/theses", label: t("navTheses") },
    { href: "/articles", label: t("navArticles") },
    { href: "/topics", label: t("navTopics") },
    { href: "/reactions", label: t("navReactions") },
    { href: "/structures", label: t("navStructures") },
    { href: "/library", label: t("navLibrary") },
  ];

  const quick = [
    { href: "/assistant", label: t("navAssistant"), icon: Bot },
    { href: "/researcher", label: t("researcherTitle"), icon: User },
    { href: "/about", label: t("navAbout"), icon: GraduationCap },
    { href: "/contact", label: t("navContact"), icon: Mail },
    { href: "/news", label: t("navNews"), icon: Workflow },
    { href: "/admin", label: t("adminDashboard"), icon: LayoutDashboard },
  ];

  return (
    <footer className="relative mt-24 border-t border-line bg-background2">
      <div className="divider-gradient absolute -top-px inset-x-0" />
      <div className="hex-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent">
              <Atom className="h-6 w-6 text-white" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-gradient">{t("siteName")}</p>
              <p className="text-[11px] tracking-widest text-muted">{t("researcherName")}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{t("footerAbout")}</p>
          <div className="mt-5 flex items-center gap-2">
            {["C", "H", "O", "N"].map((el, i) => (
              <span
                key={el}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface font-display text-xs font-bold animate-float-slow"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <span className={i % 2 === 0 ? "text-primary" : "text-secondary"}>{el}</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">{t("footerSections")}</h4>
          <ul className="grid grid-cols-1 gap-2.5">
            {sections.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-sm text-muted transition-colors hover:text-primary">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-secondary">{t("footerQuick")}</h4>
          <ul className="grid grid-cols-1 gap-2.5">
            {quick.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-secondary">
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6">
          <p>
            © {year} {t("siteName")} — {t("researcherName")}. {t("footerRights")}.
          </p>
          <p className="font-display tracking-widest text-muted/70">C₆H₆ · CH₃COOH · C₂H₅OH</p>
        </div>
      </div>
    </footer>
  );
}
