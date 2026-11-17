"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  FlaskConical,
  Globe,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useT } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  name,
  role,
}: {
  children: ReactNode;
  name: string;
  role: string;
}) {
  const { t } = useT();
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin", label: t("adminDashboard"), icon: LayoutDashboard },
    { href: "/admin/content", label: t("adminContent"), icon: FlaskConical },
    { href: "/admin/comments", label: t("adminComments"), icon: MessageSquare },
    { href: "/admin/users", label: t("adminUsers"), icon: Users },
  ];

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            <span className="text-gradient">{t("adminDashboard")}</span>
          </h1>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            {name} · {role}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="btn-ghost !py-2 text-sm">
            <Globe className="h-4 w-4" />
            {t("adminViewSite")}
          </Link>
          <button onClick={logout} className="btn-ghost !py-2 text-sm text-rose-400 cursor-pointer">
            <LogOut className="h-4 w-4" />
            {t("adminLogout")}
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition",
              pathname === l.href
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-line bg-surface text-muted hover:border-primary/40 hover:text-foreground"
            )}
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
