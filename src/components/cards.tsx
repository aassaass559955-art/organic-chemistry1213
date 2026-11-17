"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Award,
  BookOpen,
  Calendar,
  Download,
  Eye,
  FileText,
  FlaskConical,
  GraduationCap,
  Library,
  Mail,
  Newspaper,
  Orbit,
  Search,
  User,
  Users,
  Workflow,
} from "lucide-react";
import { useT } from "@/lib/store";
import { cn, formatNum, formatSize, pick } from "@/lib/utils";
import type { DictKey } from "@/lib/i18n";
import type { ArticleDTO, BookDTO } from "@/lib/types";

/* ---------------------------------- Counter --------------------------------- */

export function Counter({ value, duration = 1600 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return <span ref={ref}>{display.toLocaleString("en-US")}</span>;
}

/* ------------------------------ Section heading ------------------------------ */

export function SectionHeading({
  title,
  sub,
  icon: Icon,
}: {
  title: string;
  sub?: string;
  icon?: typeof FlaskConical;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 text-center"
    >
      {Icon && (
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
          <Icon className="h-6 w-6 text-white" />
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{sub}</p>}
      <div className="divider-gradient mx-auto mt-6 w-48" />
    </motion.div>
  );
}

/* --------------------------------- Type badge -------------------------------- */

const typeStyles: Record<ArticleDTO["type"], string> = {
  RESEARCH: "bg-primary/15 text-primary border-primary/30",
  STUDY: "bg-secondary/15 text-secondary border-secondary/30",
  THESIS: "bg-accent/15 text-accent border-accent/30",
  ARTICLE: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  NEWS: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export function TypeBadge({ type }: { type: ArticleDTO["type"] }) {
  const { t } = useT();
  return (
    <span className={cn("chip border text-[11px]", typeStyles[type])}>
      {t(`type${type}` as DictKey)}
    </span>
  );
}

/* -------------------------------- Article card ------------------------------- */

export function ArticleCard({ article, index = 0 }: { article: ArticleDTO; index?: number }) {
  const { t, lang, dir } = useT();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl p-6"
    >
      <div className="pointer-events-none absolute -top-20 -end-20 h-44 w-44 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100" />
      <div className="mb-4 flex items-center justify-between gap-2">
        <TypeBadge type={article.type} />
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar className="h-3.5 w-3.5" />
          {article.year}
        </span>
      </div>
      <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-primary">
        <Link href={`/articles/${article.slug}`}>{pick(article, "titleAr", "titleEn", lang)}</Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
        {pick(article, "abstractAr", "abstractEn", lang)}
      </p>
      <div className="mt-4 space-y-1.5 text-xs text-muted">
        <p className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-primary" />
          {pick(article, "authorName", "authorNameEn", lang)}
        </p>
        {article.university && (
          <p className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-secondary" />
            {pick(article, "university", "universityEn", lang)}
          </p>
        )}
        {article.supervisor && (
          <p className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-accent" />
            {t("supervisor")}: {article.supervisor}
          </p>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {formatNum(article.views, lang)}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" /> {formatNum(article.downloads, lang)}
          </span>
        </div>
        <Link
          href={`/articles/${article.slug}`}
          className="flex items-center gap-1 text-sm font-bold text-primary transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
        >
          {t("readMore")}
          <Arrow className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

/* --------------------------------- Book card --------------------------------- */

export function BookCard({ book, index = 0 }: { book: BookDTO; index?: number }) {
  const { t, lang } = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass card-hover group flex h-full flex-col overflow-hidden rounded-3xl"
    >
      <div
        className="relative flex h-52 items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${book.coverColor}22 0%, ${book.coverColor}44 50%, #0f172a33 100%)`,
        }}
      >
        <div className="hex-pattern absolute inset-0 opacity-60" />
        <div
          className="relative flex h-36 w-28 flex-col justify-between rounded-xl border border-white/20 p-3 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-2"
          style={{ background: `linear-gradient(160deg, ${book.coverColor}, #0f172a 130%)` }}
        >
          <FlaskConical className="h-5 w-5 text-white/80" />
          <div>
            <p className="font-display text-[11px] font-bold leading-snug text-white">
              {pick(book, "titleAr", "titleEn", lang)}
            </p>
            <p className="mt-1 text-[9px] text-white/70">{book.author}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold leading-snug">{pick(book, "titleAr", "titleEn", lang)}</h3>
        <p className="mt-1 text-xs text-muted">
          {book.author} · {book.year} · {book.pages} {t("pages")}
        </p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {pick(book, "descriptionAr", "descriptionEn", lang)}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Download className="h-3.5 w-3.5" />
            {formatNum(book.downloads, lang)} · {formatSize(book.fileSize)}
          </span>
          <div className="flex gap-2">
            <a href={book.fileUrl} target="_blank" rel="noreferrer" className="chip cursor-pointer hover:border-primary/60">
              <BookOpen className="h-3.5 w-3.5" />
              {t("preview")}
            </a>
            <a
              href={`/api/download?book=${book.id}`}
              className="chip border-primary/40 text-primary cursor-pointer hover:bg-primary/10"
            >
              <Download className="h-3.5 w-3.5" />
              {t("download")}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------- Page header -------------------------------- */

const pageIcons = {
  flask: FlaskConical,
  book: BookOpen,
  grad: GraduationCap,
  file: FileText,
  newspaper: Newspaper,
  library: Library,
  atom: Atom,
  orbit: Orbit,
  workflow: Workflow,
  users: Users,
  mail: Mail,
} as const;

export type PageIconName = keyof typeof pageIcons;

export function PageHeader({
  titleKey,
  subKey,
  icon,
}: {
  titleKey: DictKey;
  subKey?: DictKey;
  icon?: PageIconName;
}) {
  const { t } = useT();
  const Icon = icon ? pageIcons[icon] : undefined;
  return (
    <div className="relative overflow-hidden border-b border-line bg-background2">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-secondary/8 to-accent/12" />
      <div className="hex-pattern absolute inset-0 opacity-50" />
      <div className="grid-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-32 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {Icon && (
            <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-xl shadow-primary/30">
              <Icon className="h-7 w-7 text-white" />
            </span>
          )}
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-gradient">{t(titleKey)}</span>
          </h1>
          {subKey && <p className="mt-3 max-w-2xl text-muted">{t(subKey)}</p>}
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------- Empty state -------------------------------- */

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass flex flex-col items-center justify-center gap-4 rounded-3xl py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <Search className="h-7 w-7 text-muted" />
      </span>
      <p className="max-w-sm text-sm text-muted">{message}</p>
    </div>
  );
}

export function FileIcon() {
  return <FileText className="h-4 w-4" />;
}
