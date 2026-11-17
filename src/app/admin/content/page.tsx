"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  CloudUpload,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useT } from "@/lib/store";
import { cn, formatNum, formatSize, pick } from "@/lib/utils";
import { TypeBadge } from "@/components/cards";
import type { ArticleDTO, AttachmentDTO, CategoryDTO, TagDTO } from "@/lib/types";

const emptyForm = {
  type: "RESEARCH",
  titleAr: "",
  titleEn: "",
  abstractAr: "",
  abstractEn: "",
  contentAr: "",
  contentEn: "",
  authorName: "مرتضى عوض",
  authorNameEn: "Murtada Awad",
  university: "",
  universityEn: "",
  supervisor: "",
  year: new Date().getFullYear(),
  keywords: "",
  categoryId: "",
  coverUrl: "",
  published: true,
  featured: false,
  tags: [] as string[],
};

type FormState = typeof emptyForm;

function ContentManager() {
  const { t, lang } = useT();
  const qc = useQueryClient();
  const params = useSearchParams();
  const [mode, setMode] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<ArticleDTO | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [attachments, setAttachments] = useState<AttachmentDTO[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.get("new") === "1") startNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const { data: list, isLoading } = useQuery<ArticleDTO[]>({
    queryKey: ["admin-articles"],
    queryFn: async () => (await fetch("/api/articles?all=1")).json(),
  });

  const { data: meta } = useQuery<{ categories: CategoryDTO[]; tags: TagDTO[] }>({
    queryKey: ["meta"],
    queryFn: async () => (await fetch("/api/meta")).json(),
  });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (list ?? []).filter((a) => {
      if (typeFilter && a.type !== typeFilter) return false;
      if (needle && ![a.titleAr, a.titleEn, a.authorName].join(" ").toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [list, q, typeFilter]);

  function startNew() {
    setEditing(null);
    setForm(emptyForm);
    setAttachments([]);
    setMode("form");
  }

  function startEdit(a: ArticleDTO) {
    setEditing(a);
    setForm({
      type: a.type,
      titleAr: a.titleAr,
      titleEn: a.titleEn,
      abstractAr: a.abstractAr,
      abstractEn: a.abstractEn,
      contentAr: a.contentAr,
      contentEn: a.contentEn,
      authorName: a.authorName,
      authorNameEn: a.authorNameEn,
      university: a.university,
      universityEn: a.universityEn,
      supervisor: a.supervisor,
      year: a.year,
      keywords: (a.keywords || []).join("، "),
      categoryId: a.categoryId || "",
      coverUrl: a.coverUrl,
      published: a.published,
      featured: a.featured,
      tags: [],
    });
    setAttachments(a.attachments || []);
    setMode("form");
  }

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "upload failed");
      setAttachments((prev) => [...prev, { name: data.name, url: data.url, size: data.size, mime: data.mime }]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save() {
    setSaving(true);
    setNotice("");
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        keywords: form.keywords.split(/[،,]/).map((k) => k.trim()).filter(Boolean),
        categoryId: form.categoryId || null,
        attachments,
      };
      const res = editing
        ? await fetch(`/api/articles/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error();
      await qc.invalidateQueries({ queryKey: ["admin-articles"] });
      setNotice(t("adminSaved"));
      setMode("list");
    } catch {
      setNotice(t("errorGeneric"));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(t("adminConfirmDelete"))) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    await qc.invalidateQueries({ queryKey: ["admin-articles"] });
  }

  if (mode === "form") {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{editing ? t("adminEdit") : t("adminNew")}</h2>
          <button onClick={() => setMode("list")} className="btn-ghost !py-2 text-sm cursor-pointer">
            <X className="h-4 w-4" />
            {t("adminCancel")}
          </button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("filterType")}</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="field">
                {(["RESEARCH", "STUDY", "THESIS", "ARTICLE", "NEWS"] as const).map((tp) => (
                  <option key={tp} value={tp}>
                    {t(`type${tp}` as never)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("filterCategory")}</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="field">
                <option value="">—</option>
                {(meta?.categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {pick(c, "nameAr", "nameEn", lang)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("filterYear")}</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })} className="field" dir="ltr" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("adminTitleAr")}</label>
              <input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="field" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("adminTitleEn")}</label>
              <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="field" dir="ltr" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("adminAbstractAr")}</label>
              <textarea value={form.abstractAr} onChange={(e) => setForm({ ...form, abstractAr: e.target.value })} rows={3} className="field resize-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("adminAbstractEn")}</label>
              <textarea value={form.abstractEn} onChange={(e) => setForm({ ...form, abstractEn: e.target.value })} rows={3} className="field resize-none" dir="ltr" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("adminContentAr")}</label>
              <textarea value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} rows={6} className="field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("adminContentEn")}</label>
              <textarea value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} rows={6} className="field" dir="ltr" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("author")} (عربي)</label>
              <input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("author")} (EN)</label>
              <input value={form.authorNameEn} onChange={(e) => setForm({ ...form, authorNameEn: e.target.value })} className="field" dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("university")} (عربي)</label>
              <input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("university")} (EN)</label>
              <input value={form.universityEn} onChange={(e) => setForm({ ...form, universityEn: e.target.value })} className="field" dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("supervisor")}</label>
              <input value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })} className="field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">{t("keywords")} (افصل بفاصلة)</label>
              <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="field" />
            </div>
          </div>

          {meta && meta.tags.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-bold text-muted">Tags</label>
              <div className="flex flex-wrap gap-2">
                {meta.tags.map((tg) => (
                  <button
                    key={tg.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        tags: f.tags.includes(tg.slug) ? f.tags.filter((s) => s !== tg.slug) : [...f.tags, tg.slug],
                      }))
                    }
                    className={cn(
                      "chip cursor-pointer transition",
                      form.tags.includes(tg.slug) ? "border-primary/60 bg-primary/15 text-primary" : "hover:border-primary/40"
                    )}
                  >
                    {pick(tg, "nameAr", "nameEn", lang)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-bold text-muted">{t("adminUploadFile")} — {t("adminUploadHint")}</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-surface px-4 py-8 transition hover:border-primary/50"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <CloudUpload className="h-6 w-6 text-primary" />
              )}
              <span className="text-sm text-muted">{uploading ? t("loading") : t("adminUploadFile")}</span>
              <input
                ref={fileRef}
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.webp"
                onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
              />
            </div>
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((f, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-2.5">
                    <span className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-display" dir="ltr">{f.name}</span>
                      <span className="text-[11px] text-muted">{formatSize(f.size)}</span>
                    </span>
                    <button onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-muted">{t("adminCover")}</label>
            <input value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} className="field" dir="ltr" />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-emerald-500" />
              {t("adminPublished")}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-emerald-500" />
              {t("adminFeatured")}
            </label>
          </div>

          {notice && (
            <p className={cn("rounded-xl px-4 py-2.5 text-sm", notice === t("adminSaved") ? "bg-primary/10 text-primary" : "bg-rose-500/10 text-rose-400")}>
              {notice}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.titleAr.trim()} className="btn-primary disabled:opacity-50 cursor-pointer">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t("adminSave")}
            </button>
            <button onClick={() => setMode("list")} className="btn-ghost cursor-pointer">
              {t("adminCancel")}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")} className="field !ps-11" />
        </div>
        <div className="flex gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="field w-auto cursor-pointer">
            <option value="">{t("filterAll")}</option>
            {(["RESEARCH", "STUDY", "THESIS", "ARTICLE", "NEWS"] as const).map((tp) => (
              <option key={tp} value={tp}>{t(`type${tp}` as never)}</option>
            ))}
          </select>
          <button onClick={startNew} className="btn-primary !py-2.5 text-sm cursor-pointer">
            <Plus className="h-4 w-4" />
            {t("adminNew")}
          </button>
        </div>
      </div>

      {notice && (
        <p className="mb-4 flex items-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4" />
          {notice}
        </p>
      )}

      <div className="glass overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-start text-xs text-muted">
                <th className="px-5 py-4 text-start font-medium">{t("filterType")}</th>
                <th className="px-5 py-4 text-start font-medium">{t("adminTitleAr")}</th>
                <th className="px-5 py-4 text-start font-medium">{t("author")}</th>
                <th className="px-5 py-4 text-start font-medium">{t("filterYear")}</th>
                <th className="px-5 py-4 text-start font-medium">{t("downloads")}</th>
                <th className="px-5 py-4 text-start font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  </td>
                </tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-line/50 transition-colors last:border-0 hover:bg-surface/60">
                  <td className="px-5 py-3.5"><TypeBadge type={a.type} /></td>
                  <td className="max-w-[280px] px-5 py-3.5">
                    <span className="line-clamp-1 font-medium">{pick(a, "titleAr", "titleEn", lang)}</span>
                    {!a.published && <span className="chip ms-2 text-[10px] text-amber-400">{t("adminDraft")}</span>}
                  </td>
                  <td className="px-5 py-3.5 text-muted">{pick(a, "authorName", "authorNameEn", lang)}</td>
                  <td className="px-5 py-3.5 font-display">{a.year}</td>
                  <td className="px-5 py-3.5 font-display">{formatNum(a.downloads, lang)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(a)} className="rounded-lg border border-line p-2 text-muted transition hover:border-primary/50 hover:text-primary cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(a.id)} className="rounded-lg border border-line p-2 text-muted transition hover:border-rose-500/50 hover:text-rose-400 cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-muted">…</div>}>
      <ContentManager />
    </Suspense>
  );
}
