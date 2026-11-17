"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useT } from "@/lib/store";
import { pick } from "@/lib/utils";
import { ArticleCard, EmptyState } from "@/components/cards";
import type { ArticleDTO, CategoryDTO } from "@/lib/types";

export type FilterMeta = {
  authors: string[];
  years: number[];
  universities: string[];
};

export function ArticleBrowser({
  initialArticles,
  categories,
  meta,
}: {
  initialArticles: ArticleDTO[];
  categories: CategoryDTO[];
  meta: FilterMeta;
}) {
  const { t, lang } = useT();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [university, setUniversity] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return initialArticles.filter((a) => {
      if (category && a.categoryId !== category) return false;
      if (author && a.authorName !== author) return false;
      if (year && String(a.year) !== year) return false;
      if (university && a.university !== university) return false;
      if (needle) {
        const hay = [a.titleAr, a.titleEn, a.abstractAr, a.abstractEn, a.authorName, ...(a.keywords || [])]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [initialArticles, q, category, author, year, university]);

  const reset = () => {
    setQ("");
    setCategory("");
    setAuthor("");
    setYear("");
    setUniversity("");
  };

  const selectClass = "field appearance-none cursor-pointer";

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass mb-8 rounded-3xl p-4 sm:p-5"
      >
        <div className="relative">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="field !ps-11"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-muted">{t("filterCategory")}</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              <option value="">{t("filterAll")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {pick(c, "nameAr", "nameEn", lang)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-muted">{t("filterAuthor")}</label>
            <select value={author} onChange={(e) => setAuthor(e.target.value)} className={selectClass}>
              <option value="">{t("filterAll")}</option>
              {meta.authors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-muted">{t("filterYear")}</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
              <option value="">{t("filterAll")}</option>
              {meta.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-muted">{t("filterUniversity")}</label>
            <select value={university} onChange={(e) => setUniversity(e.target.value)} className={selectClass}>
              <option value="">{t("filterAll")}</option>
              {meta.universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={reset} className="btn-ghost w-full justify-center !py-2.5 text-sm cursor-pointer">
              <RotateCcw className="h-4 w-4" />
              {t("filterReset")}
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          <span>
            {filtered.length} {t("resultsCount")}
          </span>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState message={t("noResults")} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
