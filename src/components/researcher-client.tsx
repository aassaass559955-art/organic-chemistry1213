"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, BookOpen, CheckCircle2, FileBadge, FlaskConical, GraduationCap, Mail, User } from "lucide-react";
import { useT } from "@/lib/store";
import { pick } from "@/lib/utils";
import { ArticleCard, SectionHeading } from "@/components/cards";
import type { ArticleDTO, ResearcherDTO } from "@/lib/types";

export function ResearcherClient({
  researcher,
  works,
}: {
  researcher: ResearcherDTO | null;
  works: ArticleDTO[];
}) {
  const { t, lang } = useT();

  if (!researcher) return null;

  const achievements = lang === "ar" ? researcher.achievements : researcher.achievementsEn;
  const worksByType = (type: ArticleDTO["type"]) => works.filter((w) => w.type === type).length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass relative overflow-hidden rounded-[2.5rem]"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-primary/15 via-transparent to-accent/15" />
        <div className="hex-pattern absolute inset-0 opacity-40" />
        <div className="relative grid gap-8 p-8 sm:p-12 md:grid-cols-[auto_1fr] md:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto"
          >
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary via-secondary to-accent opacity-60 blur-xl animate-pulse-glow" />
            <div className="relative h-56 w-48 overflow-hidden rounded-[1.75rem] border-2 border-primary/40 sm:h-64 sm:w-56">
              <Image
                src={researcher.avatarUrl}
                alt={pick(researcher, "name", "nameEn", lang)}
                fill
                className="object-cover object-top"
                sizes="224px"
                priority
              />
            </div>
          </motion.div>

          <div className="text-center md:text-start">
            <span className="chip border-primary/30 bg-primary/10 text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              {t("researcherTitle")}
            </span>
            <h1 className="font-display mt-4 text-4xl font-black sm:text-5xl">
              <span className="text-gradient">{pick(researcher, "name", "nameEn", lang)}</span>
            </h1>
            <p className="mt-2 text-lg font-medium text-secondary">{pick(researcher, "title", "titleEn", lang)}</p>
            <p className="mt-1 text-xs text-muted">{researcher.university}</p>
            <p className="mt-5 max-w-2xl text-sm leading-loose text-muted">{pick(researcher, "bio", "bioEn", lang)}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <a href={`mailto:${researcher.email}`} className="btn-ghost !py-2.5 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                {researcher.email}
              </a>
              <span className="chip font-display py-2" dir="ltr">
                <FileBadge className="h-3.5 w-3.5 text-accent" />
                ORCID: {researcher.orcid}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { label: t("statResearches"), n: worksByType("RESEARCH"), icon: FlaskConical },
          { label: t("statStudies"), n: worksByType("STUDY"), icon: BookOpen },
          { label: t("statArticles"), n: worksByType("ARTICLE"), icon: FileBadge },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass rounded-2xl p-4 text-center sm:p-6"
          >
            <s.icon className="mx-auto h-5 w-5 text-primary" />
            <p className="font-display mt-2 text-2xl font-bold sm:text-4xl">{s.n}+</p>
            <p className="mt-1 text-[11px] text-muted sm:text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16">
        <SectionHeading title={t("researcherAchievements")} icon={Award} />
        <div className="glass rounded-3xl p-7 sm:p-9">
          <ul className="grid gap-4 sm:grid-cols-2">
            {achievements.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="flex items-start gap-3 text-sm leading-relaxed"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground/90">{a}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16">
        <SectionHeading title={t("researcherWorks")} icon={FlaskConical} />
        {works.length === 0 ? (
          <p className="text-center text-sm text-muted">{t("noResults")}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {works.map((w, i) => (
              <ArticleCard key={w.id} article={w} index={i} />
            ))}
          </div>
        )}
        {works.length === 0 && (
          <p className="mt-6 text-center">
            <Link href="/researches" className="btn-ghost">
              {t("heroExplore")}
            </Link>
          </p>
        )}
      </div>

      <div className="mt-16 text-center">
        <Link href="/contact" className="btn-primary">
          <Mail className="h-5 w-5" />
          {t("researcherContact")}
        </Link>
      </div>
    </div>
  );
}
