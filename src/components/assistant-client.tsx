"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useT } from "@/lib/store";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; text: string };

export function AssistantClient() {
  const { t, lang } = useT();
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "" }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((m) => (m.length === 1 && m[0].text === "" ? [{ role: "assistant", text: t("assistantWelcome") }] : m));
  }, [t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const suggestions =
    lang === "ar"
      ? ["ما هو التهجين sp3؟", "اشرح آلية SN2", "ما هي قاعدة هوكل؟", "كيف يعمل كاشف غرينيارد؟", "اقترح لي مراجع في الكيمياء العضوية"]
      : ["What is sp3 hybridization?", "Explain the SN2 mechanism", "What is Hückel's rule?", "How does a Grignard reagent work?", "Suggest organic chemistry references"];

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: message }]);
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, lang }),
      });
      const data = (await res.json()) as { answer: string };
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: t("errorGeneric") }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-3xl flex-col px-4 pb-8 pt-28 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent shadow-xl shadow-primary/30">
          <Bot className="h-8 w-8 text-white" />
        </span>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          <span className="text-gradient">{t("assistantTitle")}</span>
        </h1>
        <p className="mt-2 font-display text-sm tracking-widest text-muted">ORGANIC CHEMISTRY ASSISTANT</p>
      </motion.div>

      <div className="glass flex flex-1 flex-col overflow-hidden rounded-3xl">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5" style={{ minHeight: 380, maxHeight: "52vh" }}>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    m.role === "assistant" ? "bg-gradient-to-br from-primary to-accent" : "bg-secondary/20 border border-secondary/40"
                  )}
                >
                  {m.role === "assistant" ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-secondary" />}
                </span>
                <div
                  className={cn(
                    "max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "assistant"
                      ? "rounded-ts-sm bg-surface text-foreground/90"
                      : "rounded-te-sm bg-primary/15 text-foreground"
                  )}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {busy && (
            <div className="flex items-center gap-2 ps-11 text-xs text-muted">
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-secondary" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "300ms" }} />
              {t("assistantThinking")}
            </div>
          )}
        </div>

        <div className="border-t border-line p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={busy}
                className="chip cursor-pointer text-[11px] transition hover:border-primary/60 hover:text-primary"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("assistantPlaceholder")}
              className="field flex-1"
            />
            <button type="submit" disabled={busy || !input.trim()} className="btn-primary !px-5 disabled:opacity-50">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">{t("assistantSend")}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
