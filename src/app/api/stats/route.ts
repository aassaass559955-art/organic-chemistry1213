import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { articles, comments, downloads } from "@/db/schema";
import { getPublicStats } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const publicStats = await getPublicStats();

  const byType = await db
    .select({ type: articles.type, n: sql<number>`count(*)::int` })
    .from(articles)
    .groupBy(articles.type);

  const last14 = await db
    .select({
      day: sql<string>`to_char(${downloads.createdAt}::date, 'YYYY-MM-DD')`,
      n: sql<number>`count(*)::int`,
    })
    .from(downloads)
    .groupBy(sql`${downloads.createdAt}::date`)
    .orderBy(sql`${downloads.createdAt}::date`)
    .limit(14);

  const top = await db
    .select({
      id: articles.id,
      titleAr: articles.titleAr,
      titleEn: articles.titleEn,
      downloads: articles.downloads,
      views: articles.views,
      type: articles.type,
    })
    .from(articles)
    .orderBy(desc(articles.downloads))
    .limit(5);

  const pendingComments = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(comments)
    .where(eq(comments.approved, false));

  return NextResponse.json({
    ...publicStats,
    byType,
    downloadsTimeline: last14,
    topDownloads: top,
    pendingComments: pendingComments[0]?.n ?? 0,
  });
}
