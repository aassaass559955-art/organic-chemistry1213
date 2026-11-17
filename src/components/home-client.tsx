"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Atom,
  Bot,
  BookOpen,
  ChevronDown,
  FileText,
  FlaskConical,
  GraduationCap,
  Library,
  Mail,
  MessagesSquare,
  Newspaper,
  Orbit,
  Sparkles,
  Upload,
  Users,
  Workflow,
} from "lucide-react";
import { MoleculeBackground } from "@/components/three/molecule-scene";
import { ArticleCard, Counter, SectionHeading } from "@/components/cards";
import { useT } from "@/lib/store";
import type { DictKey } from "@/lib/i18n";
import type { ArticleDTO, CategoryDTO, PublicStats } from "@/lib/types";

const sectionCards: { href: string; key: DictKey; icon: typeof FlaskConical; color: string }[] = [
  { href: "/researches", key: "navResearches", icon: FlaskConical, color: "from-primary to-emerald-600" },
  { href: "/studies", key: "navStudies", icon: BookOpen, color: "from-secondary to-blue-600" },
  { href: "/theses", key: "navTheses", icon: GraduationCap, color: "from-accent to-violet-600" },
  { href: "/articles", key: "navArticles", icon: FileText, color: "from-teal-400 to-primary" },
  { href: "/topics", key: "navTopics", icon: Atom, color: "from-cyan-400 to-secondary" },
  { href: "/reactions", key: "navReactions", icon: Workflow, color: "from-primary to-cyan-500" },
  { href: "/structures", key: "navStructures", icon: Orbit, color: "from-fuchsia-500 to-accent" },
  { href: "/library", key: "navLibrary", icon: Library, color: "from-amber-400 to-orange-500" },
  { href: "/news", key: "navNews", icon: Newspaper, color: "from-rose-400 to-pink-600" },
  { href: "/about", key: "navAbout", icon: Users, color: "from-lime-400 to-primary" },
  { href: "/contact", key: "navContact", icon: Mail, color: "from-sky-400 to-secondary" },
  { href: "/assistant", key: "navAssistant", icon: Bot, color: "from-accent to-fuchsia-600" },
];

export function HomeClient({
  stats,
  featured,
  latest,
}: {
  stats: PublicStats;
  featured: ArticleDTO[];
  latest: ArticleDTO[];
  categories: CategoryDTO[];
}) {
  const { t, lang } = useT();
  const shown = featured.length >= 3 ? featured : latest;

  const statItems = [
    { label: t("statResearches"), value: stats.researches, icon: FlaskConical, tint: "text-primary" },
    { label: t("statStudies"), value: stats.studies, icon: BookOpen, tint: "text-secondary" },
    { label: t("statTheses"), value: stats.theses, icon: GraduationCap, tint: "text-accent" },
    { label: t("statVisitors"), value: stats.visitors, icon: Users, tint: "text-amber-400" },
    { label: t("statDownloads"), value: stats.downloads, icon: Upload, tint: "text-rose-400" },
    { label: t("statReactions"), value: stats.reactions, icon: Workflow, tint: "text-cyan-400" },
  ];

  return (
    <div>
      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background2 via-background to-background" />
        <MoleculeBackground />
        <div className="grid-overlay absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(0,184,148,0.12),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-28 pb-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex"
          >
            <span className="chip glass border-primary/30 px-4 py-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t("heroBadge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl font-black leading-[1.05] tracking-tight sm:text-8xl"
          >
            <span className="text-gradient animate-gradient">{t("siteName")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-bold text-primary sm:text-base"
          >
            <Atom className="h-4 w-4 animate-spin-slow" />
            {t("researcherName")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {t("tagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/researches" className="btn-primary text-base">
              <FlaskConical className="h-5 w-5" />
              {t("heroExplore")}
            </Link>
            <Link href="/admin/content?new=1" className="btn-ghost text-base">
              <Upload className="h-5 w-5 text-primary" />
              {t("heroUpload")}
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 text-[11px] tracking-widest text-muted/70 font-display"
          >
            {t("heroMolecule")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 animate-bounce text-primary" />
        </motion.div>
      </section>

      {/* ------------------------------- STATS ------------------------------ */}
      <section className="relative border-y border-line bg-background2/60 py-14">
        <div className="hex-pattern absolute inset-0 opacity-30" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6">
          {statItems.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="glass rounded-2xl p-4 text-center"
            >
              <s.icon className={`mx-auto h-5 w-5 ${s.tint}`} />
              <p className="font-display mt-2 text-2xl font-bold sm:text-3xl">
                <Counter value={s.value} />
              </p>
              <p className="mt-1 text-[11px] text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------ FEATURED ---------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading title={t("sectionFeatured")} sub={t("sectionFeaturedSub")} icon={FlaskConical} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/researches" className="btn-ghost">
            {t("viewAll")}
          </Link>
        </div>
      </section>

      {/* ------------------------------ SECTIONS ---------------------------- */}
      <section className="border-y border-line bg-background2/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title={t("sectionExplore")} sub={t("sectionExploreSub")} icon={Orbit} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sectionCards.map((s, i) => (
              <motion.div
                key={s.href}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              >
                <Link
                  href={s.href}
                  className="glass card-hover group flex h-full flex-col items-start gap-4 rounded-3xl p-5"
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <s.icon className="h-5 w-5 text-white" />
                  </span>
                  <span className="text-sm font-bold leading-snug sm:text-base">{t(s.key)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- ASSISTANT ---------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="glass relative overflow-hidden rounded-[2.5rem] p-8 sm:p-14">
          <div className="absolute inset-0 bg-gradient-to-l from-accent/15 via-transparent to-primary/15" />
          <div className="hex-pattern absolute inset-0 opacity-40" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading title={t("sectionAssistant")} sub={t("sectionAssistantSub")} icon={Sparkles} />
              <div className="text-center lg:text-start">
                <Link href="/assistant" className="btn-primary">
                  <MessagesSquare className="h-5 w-5" />
                  {t("navAssistant")}
                </Link>
              </div>
            </div>
            <div className="glass-strong rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-line pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Bot className="h-5 w-5 text-white" />
                </span>
                <div>
                  <p className="text-sm font-bold">Organic Chemistry Assistant</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                    online
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="max-w-[85%] rounded-2xl rounded-ts-sm bg-surface px-4 py-2.5 text-xs text-muted">
                  {lang === "ar" ? "ما الفرق بين SN1 و SN2؟" : "What's the difference between SN1 and SN2?"}
                </div>
                <div className="ms-auto max-w-[85%] rounded-2xl rounded-te-sm bg-primary/15 px-4 py-2.5 text-xs leading-relaxed">
                  {lang === "ar"
                    ? "SN2 خطوة واحدة بهجوم خلفي وانقلاب فراغي، بينما SN1 خطوتان عبر كاتيون كربوني…"
                    : "SN2 is one concerted step with backside attack; SN1 proceeds via a carbocation in two steps…"}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-secondary" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "300ms" }} />
                  {t("assistantThinking")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
