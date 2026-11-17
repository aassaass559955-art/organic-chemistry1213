import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { getArticle, serializeArticle } from "@/lib/data";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const article = await getArticle(id);
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await getSession();
  if (!session || session.role === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const allowed = [
      "type", "titleAr", "titleEn", "abstractAr", "abstractEn", "contentAr", "contentEn",
      "authorName", "authorNameEn", "university", "universityEn", "supervisor", "year",
      "keywords", "coverUrl", "attachments", "categoryId", "published", "featured", "slug",
    ] as const;
    const patch: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) patch[key] = body[key];
    }
    patch.updatedAt = new Date();
    const [updated] = await db
      .update(articles)
      .set(patch)
      .where(eq(articles.id, id))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(serializeArticle(updated));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.delete(articles).where(eq(articles.id, id));
  return NextResponse.json({ ok: true });
}
