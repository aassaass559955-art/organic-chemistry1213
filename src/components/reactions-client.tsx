"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FlaskConical, Search, Thermometer, TestTube2 } from "lucide-react";
import { useT } from "@/lib/store";
import { cn, pick } from "@/lib/utils";
import { EmptyState } from "@/components/cards";
import type { DictKey } from "@/lib/i18n";
import type { ReactionDTO } from "@/lib/types";

const typeKeys: Record<ReactionDTO["type"], DictKey> = {
  NAMED: "reactionNAMED",
  MECHANISM: "reactionMECHANISM",
  SYNTHESIS: "reactionSYNTHESIS",
  GENERAL: "reactionGENERAL",
};

const typeColors: Record<ReactionDTO["type"], string> = {
  NAMED: "border-primary/40 bg-primary/10 text-primary",
  MECHANISM: "border-secondary/40 bg-secondary/10 text-secondary",
  SYNTHESIS: "border-accent/40 bg-accent/10 text-accent",
  GENERAL: "border-amber-500/40 bg-amber-500/10 text-amber-400",
};

export function ReactionsClient({ reactions }: { reactions: ReactionDTO[] }) {
  const { t, lang } = useT();
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return reactions.filter((r) => {
      if (type && r.type !== type) return false;
      if (needle) {
        const hay = [r.nameAr, r.nameEn, r.descriptionAr, r.descriptionEn, r.equation].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [reactions, q, type]);

  const types: { value: string; label: string }[] = [
    { value: "", label: t("filterAll") },
    { value: "NAMED", label: t("reactionNAMED") },
    { value: "MECHANISM", label: t("reactionMECHANISM") },
    { value: "SYNTHESIS", label: t("reactionSYNTHESIS") },
    { value: "GENERAL", label: t("reactionGENERAL") },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass mb-8 rounded-3xl p-4 sm:p-5">
        <div className="relative">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")} className="field !ps-11" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map((tp) => (
            <button
              key={tp.value}
              onClick={() => setType(tp.value)}
              className={cn(
                "chip cursor-pointer transition",
                type === tp.value ? "border-primary/60 bg-primary/15 text-primary" : "hover:border-primary/40"
              )}
            >
              {tp.label}
            </button>
          ))}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState message={t("noResults")} />
      ) : (
        <div className="space-y-4">
          {filtered.map((r, i) => {
            const open = openId === r.id;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.06 }}
                className="glass card-hover overflow-hidden rounded-3xl"
              >
                <button
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className={cn("hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border sm:flex", typeColors[r.type])}>
                      <FlaskConical className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{pick(r, "nameAr", "nameEn", lang)}</h3>
                        <span className={cn("chip border text-[10px]", typeColors[r.type])}>{t(typeKeys[r.type])}</span>
                      </div>
                      <p className="font-display mt-1 text-xs text-muted sm:text-sm" dir="ltr">
                        {r.equation}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted transition-transform", open && "rotate-180 text-primary")} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-5 border-t border-line px-6 py-6">
                        <div>
                          <h4 className="mb-2 text-sm font-bold text-primary">{lang === "ar" ? "الوصف" : "Description"}</h4>
                          <p className="text-sm leading-relaxed text-muted">{pick(r, "descriptionAr", "descriptionEn", lang)}</p>
                        </div>
                        {(r.mechanismAr || r.mechanismEn) && (
                          <div>
                            <h4 className="mb-2 text-sm font-bold text-secondary">{t("mechanism")}</h4>
                            <p className="text-sm leading-relaxed text-muted">{pick(r, "mechanismAr", "mechanismEn", lang)}</p>
                          </div>
                        )}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-line bg-surface p-4">
                            <p className="mb-1.5 flex items-center gap-2 text-xs font-bold text-muted">
                              <TestTube2 className="h-4 w-4 text-primary" />
                              {t("reagents")}
                            </p>
                            <p className="font-display text-sm" dir="auto">{r.reagents}</p>
                          </div>
                          <div className="rounded-2xl border border-line bg-surface p-4">
                            <p className="mb-1.5 flex items-center gap-2 text-xs font-bold text-muted">
                              <Thermometer className="h-4 w-4 text-accent" />
                              {t("conditions")}
                            </p>
                            <p className="text-sm">{r.conditions}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
