"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Atom, Eye, Layers } from "lucide-react";
import { useT } from "@/lib/store";
import { formatNum, pick } from "@/lib/utils";
import { EmptyState } from "@/components/cards";
import type { TopicDTO } from "@/lib/types";

const categoryLabels: Record<string, { ar: string; en: string }> = {
  basics: { ar: "أساسيات", en: "Basics" },
  mechanisms: { ar: "آليات", en: "Mechanisms" },
  reactions: { ar: "تفاعلات", en: "Reactions" },
  structures: { ar: "تراكيب", en: "Structures" },
  general: { ar: "عام", en: "General" },
};

export function categoryLabel(cat: string, lang: "ar" | "en") {
  return categoryLabels[cat]?.[lang] ?? cat;
}

export function TopicsClient({ topics }: { topics: TopicDTO[] }) {
  const { t, lang, dir } = useT();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  if (topics.length === 0) return <EmptyState message={t("noResults")} />;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {topics.map((topic, i) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
        >
          <Link href={`/topics/${topic.slug}`} className="glass card-hover group relative block h-full overflow-hidden rounded-3xl p-7">
            <div className="pointer-events-none absolute -top-16 -start-16 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
            <div className="mb-4 flex items-center justify-between">
              <span className="chip border-secondary/30 bg-secondary/10 text-xs text-secondary">
                <Layers className="h-3 w-3" />
                {categoryLabel(topic.category, lang)}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Eye className="h-3.5 w-3.5" />
                {formatNum(topic.views, lang)}
              </span>
            </div>
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/25 transition-transform duration-500 group-hover:rotate-6">
              <Atom className="h-6 w-6 text-primary" />
            </span>
            <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-primary">
              {pick(topic, "titleAr", "titleEn", lang)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{pick(topic, "summaryAr", "summaryEn", lang)}</p>
            <p className="mt-5 flex items-center gap-1.5 text-sm font-bold text-primary">
              {t("readMore")}
              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
