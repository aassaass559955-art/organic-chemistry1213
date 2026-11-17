"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Loader2, MessageSquare, Trash2, X } from "lucide-react";
import { useT } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/cards";

type AdminComment = {
  id: string;
  articleId: string;
  articleTitle: string;
  name: string;
  email: string;
  body: string;
  approved: boolean;
  createdAt: string;
};

export default function AdminCommentsPage() {
  const { t, lang } = useT();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<AdminComment[]>({
    queryKey: ["admin-comments"],
    queryFn: async () => (await fetch("/api/comments?all=1")).json(),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-comments"] });

  const approve = async (id: string, approved: boolean) => {
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm(t("adminConfirmDelete"))) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    refresh();
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
        <MessageSquare className="h-5 w-5 text-secondary" />
        {t("adminComments")} ({data?.length ?? 0})
      </h2>
      {!data?.length ? (
        <EmptyState message={t("noComments")} />
      ) : (
        <div className="space-y-3">
          {data.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <p className="font-bold text-primary">{c.name}</p>
                  <span className="text-xs text-muted" dir="ltr">{c.email}</span>
                  <span className={cn("chip text-[10px]", c.approved ? "border-primary/40 text-primary" : "border-amber-500/40 text-amber-400")}>
                    {c.approved ? t("adminPublished") : t("adminPending")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted">{formatDate(c.createdAt, lang)}</span>
                  {!c.approved && (
                    <button onClick={() => approve(c.id, true)} className="rounded-lg border border-primary/40 p-2 text-primary transition hover:bg-primary/10 cursor-pointer">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {c.approved && (
                    <button onClick={() => approve(c.id, false)} className="rounded-lg border border-line p-2 text-muted transition hover:text-amber-400 cursor-pointer">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => remove(c.id)} className="rounded-lg border border-line p-2 text-muted transition hover:text-rose-400 cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{c.body}</p>
              {c.articleTitle && <p className="mt-2 text-[11px] text-secondary">↳ {c.articleTitle}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
