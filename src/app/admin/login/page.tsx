"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Atom, Lock, LogIn, Mail } from "lucide-react";
import { useT } from "@/lib/store";
import { MoleculeBackground } from "@/components/three/molecule-scene";

function LoginForm() {
  const { t } = useT();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error();
      router.replace(params.get("next") || "/admin");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="relative">
        <Mail className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("adminEmail")}
          className="field !ps-11"
          required
          dir="ltr"
        />
      </div>
      <div className="relative">
        <Lock className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("adminPassword")}
          className="field !ps-11"
          required
          dir="ltr"
        />
      </div>
      {status === "error" && (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-400">
          {t("errorGeneric")}
        </p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center disabled:opacity-60">
        <LogIn className="h-4 w-4" />
        {status === "loading" ? t("loading") : t("adminSignIn")}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  const { t } = useT();
  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-background2 to-background" />
      <MoleculeBackground mini />
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative z-10 w-full max-w-md rounded-[2rem] p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
            <Atom className="h-7 w-7 text-white" />
          </span>
          <h1 className="font-display text-2xl font-bold">{t("adminLogin")}</h1>
          <p className="mt-1 text-xs text-muted">{t("adminLoginSub")}</p>
        </div>
        <Suspense fallback={<div className="py-8 text-center text-sm text-muted">…</div>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
