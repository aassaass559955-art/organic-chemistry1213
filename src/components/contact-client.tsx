"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, Send, User } from "lucide-react";
import { useT } from "@/lib/store";
import { PageHeader } from "@/components/cards";
import { cn } from "@/lib/utils";

export function ContactClient() {
  const { t, lang } = useT();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const info = [
    { icon: Mail, label: t("contactEmail"), value: "murtada@organic-chemistry.site", ltr: true },
    { icon: User, label: t("researcherTitle"), value: t("researcherName") },
    { icon: MapPin, label: t("university"), value: lang === "ar" ? "العراق — بغداد" : "Baghdad — Iraq" },
  ];

  return (
    <>
      <PageHeader titleKey="contactTitle" subKey="contactSub" icon="mail" />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {info.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="glass flex items-center gap-4 rounded-2xl p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30">
                  <item.icon className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="mt-0.5 text-sm font-bold" dir={item.ltr ? "ltr" : undefined}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass rounded-3xl p-7 sm:p-8"
          >
            {status === "sent" ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center gap-4 text-center">
                <CheckCircle2 className="h-14 w-14 text-primary" />
                <p className="text-lg font-bold">{t("contactSuccess")}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={form.name} onChange={set("name")} placeholder={t("contactName")} className="field" required minLength={2} />
                  <input value={form.email} onChange={set("email")} type="email" placeholder={t("contactEmail")} className="field" required />
                </div>
                <input value={form.subject} onChange={set("subject")} placeholder={t("contactSubject")} className="field" required />
                <textarea value={form.message} onChange={set("message")} placeholder={t("contactMessage")} rows={6} className="field resize-none" required minLength={10} />
                {status === "error" && <p className="text-sm text-rose-400">{t("errorGeneric")}</p>}
                <div>
                  <button type="submit" disabled={status === "sending"} className={cn("btn-primary", status === "sending" && "opacity-60")}>
                    <Send className="h-4 w-4" />
                    {status === "sending" ? t("loading") : t("contactSend")}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
