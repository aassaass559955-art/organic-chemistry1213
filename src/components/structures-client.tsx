"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Orbit } from "lucide-react";
import { useT } from "@/lib/store";
import { pick } from "@/lib/utils";
import { MiniMolecule } from "@/components/three/molecule-scene";
import type { TopicDTO } from "@/lib/types";

export function StructuresClient({ structures }: { structures: TopicDTO[] }) {
  const { t, lang, dir } = useT();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const featured = [
    { kind: "benzene" as const, label: "C₆H₆", name: lang === "ar" ? "البنزين" : "Benzene", slug: "benzene-structure" },
    { kind: "methane" as const, label: "CH₄", name: lang === "ar" ? "الميثان" : "Methane", slug: "methane-structure" },
  ];

  return (
    <div>
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        {featured.map((m, i) => (
          <motion.div
            key={m.kind}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            className="glass card-hover group overflow-hidden rounded-3xl"
          >
            <div className="relative h-64 bg-background2/60">
              <MiniMolecule kind={m.kind} />
              <span className="chip absolute left-1/2 top-4 -translate-x-1/2 font-display text-sm tracking-widest">
                {m.label}
              </span>
            </div>
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="flex items-center gap-2 font-bold">
                  <Orbit className="h-4 w-4 text-primary" />
                  {m.name}
                </p>
                <p className="mt-1 text-xs text-muted">{t("heroMolecule")}</p>
              </div>
              <Link href={`/topics/${m.slug}`} className="chip border-primary/40 text-primary hover:bg-primary/10">
                {t("readMore")}
                <Arrow className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {structures.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
          >
            <Link href={`/topics/${s.slug}`} className="glass card-hover group block h-full rounded-3xl p-6">
              <h3 className="font-display text-xl font-bold group-hover:text-primary">
                {pick(s, "titleAr", "titleEn", lang)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{pick(s, "summaryAr", "summaryEn", lang)}</p>
              <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-primary">
                {t("readMore")}
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
