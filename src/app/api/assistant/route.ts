import { NextRequest, NextResponse } from "next/server";
import { ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { reactions, topics } from "@/db/schema";
import { fallbackAnswer, knowledgeBase } from "@/lib/knowledge";

export const dynamic = "force-dynamic";

function scoreEntry(message: string, keywords: string[]) {
  let score = 0;
  for (const k of keywords) {
    if (message.includes(k.toLowerCase())) score += k.length;
  }
  return score;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim().slice(0, 600);
    const lang = body.lang === "en" ? "en" : "ar";
    if (!message) return NextResponse.json({ error: "Empty message" }, { status: 400 });

    const lower = message.toLowerCase();

    let best: { score: number; ar: string; en: string } | null = null;
    for (const entry of knowledgeBase) {
      const s = scoreEntry(lower, entry.keywords);
      if (s > 0 && (!best || s > best.score)) best = { score: s, ar: entry.ar, en: entry.en };
    }
    if (best) {
      return NextResponse.json({ answer: lang === "ar" ? best.ar : best.en });
    }

    /* Fallback: search the live database (reactions & topics) */
    const tokens = lower
      .split(/[^\p{L}\p{N}]+/u)
      .filter((w) => w.length >= 3)
      .slice(0, 3);

    for (const token of tokens) {
      const pattern = `%${token}%`;
      const [rxn] = await db
        .select()
        .from(reactions)
        .where(or(ilike(reactions.nameAr, pattern), ilike(reactions.nameEn, pattern)))
        .limit(1);
      if (rxn) {
        const answer =
          lang === "ar"
            ? `وجدت في قاعدة التفاعلات: «${rxn.nameAr}».\nالمعادلة: ${rxn.equation}\n${rxn.descriptionAr}\nالكواشف: ${rxn.reagents} — الظروف: ${rxn.conditions}.\nالمزيد في صفحة «التفاعلات العضوية».`
            : `Found in the reactions database: "${rxn.nameEn}".\nEquation: ${rxn.equation}\n${rxn.descriptionEn}\nReagents: ${rxn.reagents} — Conditions: ${rxn.conditions}.`;
        return NextResponse.json({ answer });
      }
      const [topic] = await db
        .select()
        .from(topics)
        .where(or(ilike(topics.titleAr, pattern), ilike(topics.titleEn, pattern), ilike(topics.contentAr, pattern)))
        .limit(1);
      if (topic) {
        const answer =
          lang === "ar"
            ? `وجدت شرحاً مفصلاً: «${topic.titleAr}» — ${topic.summaryAr}\nاقرأ الشرح الكامل في صفحة «شرح المواضيع الكيميائية».`
            : `Found a detailed tutorial: "${topic.titleEn}" — ${topic.summaryEn}\nRead the full explanation under "Chemistry Topics".`;
        return NextResponse.json({ answer });
      }
    }

    return NextResponse.json({ answer: lang === "ar" ? fallbackAnswer.ar : fallbackAnswer.en });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Assistant unavailable" }, { status: 500 });
  }
}
