"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  FlaskConical,
  GraduationCap,
  MessageSquare,
  Newspaper,
  Send,
  FileText,
  Users,
  Workflow,
} from "lucide-react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { useT } from "@/lib/store";
import { cn, pick } from "@/lib/utils";
import type { DictKey } from "@/lib/i18n";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type StatsPayload = {
  researches: number;
  studies: number;
  theses: number;
  articles: number;
  news: number;
  visitors: number;
  downloads: number;
  topics: number;
  reactions: number;
  books: number;
  byType: { type: string; n: number }[];
  downloadsTimeline: { day: string; n: number }[];
  topDownloads: { id: string; titleAr: string; titleEn: string; downloads: number; views: number; type: string }[];
  pendingComments: number;
};

export default function AdminDashboard() {
  const { t, lang } = useT();
  const { data } = useQuery<StatsPayload>({
    queryKey: ["admin-stats"],
    queryFn: async () => (await fetch("/api/stats")).json(),
  });

  const [notif, setNotif] = useState({ titleAr: "", titleEn: "", bodyAr: "", bodyEn: "" });
  const [notifStatus, setNotifStatus] = useState<"idle" | "sending" | "sent">("idle");

  const publishNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifStatus("sending");
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notif),
    });
    setNotifStatus("sent");
    setNotif({ titleAr: "", titleEn: "", bodyAr: "", bodyEn: "" });
    setTimeout(() => setNotifStatus("idle"), 2500);
  };

  const cards: { label: string; value: number; icon: typeof FlaskConical; tint: string }[] = [
    { label: t("statResearches"), value: data?.researches ?? 0, icon: FlaskConical, tint: "from-primary to-emerald-600" },
    { label: t("statStudies"), value: data?.studies ?? 0, icon: BookOpen, tint: "from-secondary to-blue-600" },
    { label: t("statTheses"), value: data?.theses ?? 0, icon: GraduationCap, tint: "from-accent to-violet-600" },
    { label: t("statArticles"), value: data?.articles ?? 0, icon: FileText, tint: "from-teal-400 to-primary" },
    { label: t("statVisitors"), value: data?.visitors ?? 0, icon: Users, tint: "from-amber-400 to-orange-500" },
    { label: t("statDownloads"), value: data?.downloads ?? 0, icon: Download, tint: "from-rose-400 to-pink-600" },
    { label: t("statReactions"), value: data?.reactions ?? 0, icon: Workflow, tint: "from-cyan-400 to-secondary" },
    { label: t("adminPending") + " — " + t("adminComments"), value: data?.pendingComments ?? 0, icon: MessageSquare, tint: "from-fuchsia-400 to-accent" },
  ];

  const typeLabels: Record<string, DictKey> = {
    RESEARCH: "typeRESEARCH",
    STUDY: "typeSTUDY",
    THESIS: "typeTHESIS",
    ARTICLE: "typeARTICLE",
    NEWS: "typeNEWS",
  };

  const doughnutData = {
    labels: (data?.byType ?? []).map((b) => t(typeLabels[b.type] ?? "typeARTICLE")),
    datasets: [
      {
        data: (data?.byType ?? []).map((b) => b.n),
        backgroundColor: ["#00B894", "#0984E3", "#6C5CE7", "#14B8A6", "#F59E0B"],
        borderColor: "rgba(15,23,42,0.6)",
        borderWidth: 3,
      },
    ],
  };

  const lineData = {
    labels: (data?.downloadsTimeline ?? []).map((d) => d.day.slice(5)),
    datasets: [
      {
        label: t("statDownloads"),
        data: (data?.downloadsTimeline ?? []).map((d) => d.n),
        borderColor: "#00B894",
        backgroundColor: "rgba(0,184,148,0.18)",
        fill: true,
        tension: 0.42,
        pointBackgroundColor: "#0984E3",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#94A3B8", font: { family: "Tajawal" } } },
    },
    scales: {
      x: { ticks: { color: "#94A3B8" }, grid: { color: "rgba(148,163,184,0.08)" } },
      y: { ticks: { color: "#94A3B8", precision: 0 }, grid: { color: "rgba(148,163,184,0.08)" } },
    },
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="glass card-hover rounded-3xl p-5"
          >
            <span className={cn("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white", c.tint)}>
              <c.icon className="h-5 w-5" />
            </span>
            <p className="font-display text-3xl font-bold">{c.value.toLocaleString("en-US")}</p>
            <p className="mt-1 text-xs text-muted">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <Newspaper className="h-4 w-4 text-primary" />
            {t("adminChartByType")}
          </h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: chartOptions.plugins }} />
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <Download className="h-4 w-4 text-secondary" />
            {t("adminChartDownloads")}
          </h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h3 className="mb-4 text-sm font-bold">{t("adminTopDownloads")}</h3>
          <div className="space-y-3">
            {(data?.topDownloads ?? []).map((a, i) => (
              <div key={a.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-display flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="line-clamp-1 text-sm">{pick(a, "titleAr", "titleEn", lang)}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                  <Download className="h-3.5 w-3.5 text-primary" />
                  {a.downloads}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <Send className="h-4 w-4 text-accent" />
            {t("adminNewNotification")}
          </h3>
          <form onSubmit={publishNotif} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={notif.titleAr}
                onChange={(e) => setNotif((n) => ({ ...n, titleAr: e.target.value }))}
                placeholder={t("adminNotifTitle") + " (عربي)"}
                className="field"
                required
              />
              <input
                value={notif.titleEn}
                onChange={(e) => setNotif((n) => ({ ...n, titleEn: e.target.value }))}
                placeholder={t("adminNotifTitle") + " (EN)"}
                className="field"
                dir="ltr"
              />
            </div>
            <textarea
              value={notif.bodyAr}
              onChange={(e) => setNotif((n) => ({ ...n, bodyAr: e.target.value }))}
              placeholder={t("adminNotifBody") + " (عربي)"}
              rows={2}
              className="field resize-none"
            />
            <textarea
              value={notif.bodyEn}
              onChange={(e) => setNotif((n) => ({ ...n, bodyEn: e.target.value }))}
              placeholder={t("adminNotifBody") + " (EN)"}
              rows={2}
              className="field resize-none"
              dir="ltr"
            />
            <div className="flex items-center gap-3">
              <button type="submit" disabled={notifStatus !== "idle"} className="btn-primary !py-2.5 text-sm disabled:opacity-60">
                <Send className="h-4 w-4" />
                {notifStatus === "sent" ? t("adminSaved") : t("adminSend")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
