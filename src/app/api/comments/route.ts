import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, comments } from "@/db/schema";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const articleId = sp.get("article");
  if (sp.get("all") === "1") {
    const session = await getSession();
    if (!session || session.role === "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await db.select().from(comments).orderBy(desc(comments.createdAt)).limit(200);
    const arts = await db.select({ id: articles.id, titleAr: articles.titleAr }).from(articles);
    const titleOf = new Map(arts.map((a) => [a.id, a.titleAr]));
    return NextResponse.json(rows.map((c) => ({ ...c, articleTitle: titleOf.get(c.articleId) || "" })));
  }
  if (!articleId) return NextResponse.json([]);
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.articleId, articleId))
    .orderBy(desc(comments.createdAt));
  return NextResponse.json(rows.filter((c) => c.approved));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const text = String(body.body || "").trim();
    const articleId = String(body.articleId || "");
    if (!name || name.length < 2) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!text || text.length < 3 || text.length > 2000) {
      return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!articleId) return NextResponse.json({ error: "Missing article" }, { status: 400 });

    const [created] = await db
      .insert(comments)
      .values({ articleId, name: name.slice(0, 80), email: email.slice(0, 120), body: text.slice(0, 2000), approved: false })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
