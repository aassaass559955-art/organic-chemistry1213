"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, Eye, FileText, FlaskConical, Orbit } from "lucide-react";
import { useT } from "@/lib/store";
import { formatNum, formatSize, pick } from "@/lib/utils";
import { MiniMolecule } from "@/components/three/molecule-scene";
import { categoryLabel } from "@/components/topics-client";
import type { TopicDTO } from "@/lib/types";

function moleculeFor(slug: string): "benzene" | "methane" | "network" | null {
  if (slug.includes("benzene")) return "benzene";
  if (slug.includes("methane") || slug.includes("ethanol")) return "methane";
  return null;
}

export function TopicDetailClient({ topic }: { topic: TopicDTO }) {
  const { t, lang, dir } = useT();
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const mol = moleculeFor(topic.slug);
  const backHref = topic.kind === "STRUCTURE" ? "/structures" : "/topics";

  const paragraphs = pick(topic, "contentAr", "contentEn", lang)
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary">
          <Arrow className="h-4 w-4" />
          {t("back")}
        </Link>

        <div className="glass relative overflow-hidden rounded-3xl">
          {mol && (
            <div className="relative h-72 border-b border-line bg-background2/60 sm:h-96">
              <MiniMolecule kind={mol} />
              <span className="chip absolute bottom-4 start-4">
                <Orbit className="h-3.5 w-3.5 text-primary" />
                {t("heroMolecule")}
              </span>
            </div>
          )}
          {!mol && (
            <div className="relative h-40 overflow-hidden border-b border-line bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
              <div className="hex-pattern absolute inset-0 opacity-60" />
              <FlaskConical className="absolute end-8 top-1/2 h-20 w-20 -translate-y-1/2 text-primary/30" />
            </div>
          )}
          <div className="p-7 sm:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="chip border-secondary/30 bg-secondary/10 text-xs text-secondary">
                {categoryLabel(topic.category, lang)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Eye className="h-3.5 w-3.5" />
                {formatNum(topic.views, lang)} {t("views")}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-snug sm:text-4xl">
              {pick(topic, "titleAr", "titleEn", lang)}
            </h1>
            <p className="mt-3 text-muted">{pick(topic, "summaryAr", "summaryEn", lang)}</p>

            <div className="mt-8 space-y-5">
              {paragraphs.map((p, i) => (
                <p key={i} className="leading-loose text-foreground/90">
                  {p}
                </p>
              ))}
            </div>

            {topic.attachments.length > 0 && (
              <div className="mt-10 border-t border-line pt-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
                  <FileText className="h-4 w-4 text-primary" />
                  {t("attachments")}
                </h3>
                <div className="grid gap-3">
                  {topic.attachments.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15">
                          <FileText className="h-5 w-5 text-secondary" />
                        </span>
                        <div>
                          <p className="font-display text-sm" dir="ltr">{f.name}</p>
                          <p className="text-[11px] text-muted">{formatSize(f.size)}</p>
                        </div>
                      </div>
                      <a href={f.url} target="_blank" rel="noreferrer" className="chip border-primary/40 text-primary cursor-pointer hover:bg-primary/10">
                        <Download className="h-3.5 w-3.5" />
                        {t("download")}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
