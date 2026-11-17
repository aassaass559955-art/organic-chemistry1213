"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Award,
  Calendar,
  Download,
  Eye,
  FileArchive,
  FileImage,
  FileText,
  GraduationCap,
  MessageSquare,
  Presentation,
  Send,
  Tag,
  User,
} from "lucide-react";
import { useT } from "@/lib/store";
import { cn, formatDate, formatNum, formatSize, pick } from "@/lib/utils";
import { TypeBadge } from "@/components/cards";
import type { ArticleDTO, CommentDTO } from "@/lib/types";

function attachmentIcon(mime: string) {
  if (mime.includes("pdf")) return FileText;
  if (mime.includes("image")) return FileImage;
  if (mime.includes("zip")) return FileArchive;
  if (mime.includes("presentation") || mime.includes("ppt")) return Presentation;
  return FileText;
}

export function ArticleDetailClient({
  article,
  initialComments,
}: {
  article: ArticleDTO;
  initialComments: CommentDTO[];
}) {
  const { t, lang, dir } = useT();
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id, name, email, body }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setBody("");
    } catch {
      setError(t("errorGeneric"));
      setStatus("idle");
    }
  };

  const paragraphs = pick(article, "contentAr", "contentEn", lang)
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const backHref =
    article.type === "RESEARCH" ? "/researches"
    : article.type === "STUDY" ? "/studies"
    : article.type === "THESIS" ? "/theses"
    : article.type === "NEWS" ? "/news"
    : "/articles";

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary">
          <Arrow className="h-4 w-4" />
          {t("back")}
        </Link>

        <div className="glass relative overflow-hidden rounded-3xl p-7 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/10" />
          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <TypeBadge type={article.type} />
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(article.createdAt, lang)} · {article.year}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Eye className="h-3.5 w-3.5" />
                {formatNum(article.views, lang)} {t("views")}
              </span>
            </div>

            <h1 className="text-2xl font-bold leading-snug sm:text-4xl sm:leading-tight">
              {pick(article, "titleAr", "titleEn", lang)}
            </h1>

            <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {t("author")}: <span className="text-foreground">{pick(article, "authorName", "authorNameEn", lang)}</span>
              </p>
              {article.university && (
                <p className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-secondary" />
                  {pick(article, "university", "universityEn", lang)}
                </p>
              )}
              {article.supervisor && (
                <p className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  {t("supervisor")}: <span className="text-foreground">{article.supervisor}</span>
                </p>
              )}
              <p className="flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                {formatNum(article.downloads, lang)} {t("downloads")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="glass mt-6 rounded-3xl p-7 sm:p-10"
      >
        <h2 className="mb-4 border-s-4 border-primary ps-4 text-lg font-bold text-primary">
          {lang === "ar" ? "الملخص" : "Abstract"}
        </h2>
        <p className="leading-loose text-muted">{pick(article, "abstractAr", "abstractEn", lang)}</p>

        {paragraphs.length > 0 && (
          <div className="mt-8 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-loose text-foreground/90">
                {p}
              </p>
            ))}
          </div>
        )}

        {article.keywords.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-muted">
              <Tag className="h-4 w-4 text-secondary" />
              {t("keywords")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((k) => (
                <span key={k} className="chip text-xs">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {article.attachments.length > 0 && (
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
              <FileText className="h-4 w-4 text-primary" />
              {t("attachments")}
            </h3>
            <div className="grid gap-3">
              {article.attachments.map((f, idx) => {
                const Icon = attachmentIcon(f.mime);
                return (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                        <Icon className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <p className="font-display text-sm font-semibold" dir="ltr">
                          {f.name}
                        </p>
                        <p className="text-[11px] text-muted">
                          {formatSize(f.size)} · {t("publishedAt")} {formatDate(article.createdAt, lang)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={f.url} target="_blank" rel="noreferrer" className="chip cursor-pointer hover:border-secondary/60">
                        <Eye className="h-3.5 w-3.5" />
                        {t("preview")}
                      </a>
                      <a
                        href={`/api/download?article=${article.id}&file=${idx}`}
                        className="chip border-primary/40 text-primary cursor-pointer hover:bg-primary/10"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {t("download")}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* ------------------------------ Comments ------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="glass mt-6 rounded-3xl p-7 sm:p-8"
      >
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
          <MessageSquare className="h-5 w-5 text-secondary" />
          {t("comments")} ({comments.length})
        </h2>

        <div className="space-y-4">
          {comments.length === 0 && <p className="text-sm text-muted">{t("noComments")}</p>}
          {comments.map((c) => (
            <div key={c.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-bold text-primary">{c.name}</p>
                <p className="text-[11px] text-muted">{formatDate(c.createdAt, lang)}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted">{c.body}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submitComment} className="mt-8 border-t border-line pt-6">
          <h3 className="mb-4 text-sm font-bold">{t("addComment")}</h3>
          {status === "sent" ? (
            <p className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
              {t("commentPending")}
            </p>
          ) : (
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("commentName")} className="field" required />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("commentEmail")} type="email" className="field" />
              </div>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={t("commentBody")} rows={4} className="field resize-none" required />
              {error && <p className="text-xs text-rose-400">{error}</p>}
              <div>
                <button type="submit" disabled={status === "sending"} className={cn("btn-primary text-sm", status === "sending" && "opacity-60")}>
                  <Send className="h-4 w-4" />
                  {status === "sending" ? t("loading") : t("commentSubmit")}
                </button>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
