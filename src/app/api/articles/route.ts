import { NextRequest, NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { articles, articleTags, tags as tagsTable } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { listArticles, serializeArticle } from "@/lib/data";
import type { Attachment } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const session = await getSession();
  const isStaff = !!session && session.role !== "USER";
  const rows = await listArticles({
    type: sp.get("type") || undefined,
    q: sp.get("q") || undefined,
    category: sp.get("category") || undefined,
    author: sp.get("author") || undefined,
    year: sp.get("year") || undefined,
    university: sp.get("university") || undefined,
    all: isStaff && sp.get("all") === "1",
  });
  return NextResponse.json(rows);
}

function slugify(text: string) {
  const base = text
    .toLowerCase()
    .replace(/[^؀-ۿa-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "item"}-${Date.now().toString(36)}`;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const titleAr = String(body.titleAr || "").trim();
    if (!titleAr || titleAr.length < 4) {
      return NextResponse.json({ error: "Arabic title is required" }, { status: 400 });
    }
    const validTypes = ["RESEARCH", "STUDY", "THESIS", "ARTICLE", "NEWS"];
    const type = validTypes.includes(body.type) ? body.type : "ARTICLE";

    const tagSlugs: string[] = Array.isArray(body.tags) ? body.tags.map(String) : [];

    const [created] = await db
      .insert(articles)
      .values({
        type,
        slug: slugify(body.slug || body.titleEn || titleAr),
        titleAr,
        titleEn: String(body.titleEn || ""),
        abstractAr: String(body.abstractAr || ""),
        abstractEn: String(body.abstractEn || ""),
        contentAr: String(body.contentAr || ""),
        contentEn: String(body.contentEn || ""),
        authorName: String(body.authorName || "مرتضى عوض"),
        authorNameEn: String(body.authorNameEn || ""),
        university: String(body.university || ""),
        universityEn: String(body.universityEn || ""),
        supervisor: String(body.supervisor || ""),
        year: Number.isFinite(+body.year) ? +body.year : new Date().getFullYear(),
        keywords: Array.isArray(body.keywords) ? body.keywords.map(String).slice(0, 20) : [],
        coverUrl: String(body.coverUrl || ""),
        attachments: Array.isArray(body.attachments) ? (body.attachments as Attachment[]) : [],
        categoryId: body.categoryId || null,
        published: body.published !== false,
        featured: !!body.featured,
      })
      .returning();

    if (tagSlugs.length) {
      const tagRows = await db.select().from(tagsTable).where(inArray(tagsTable.slug, tagSlugs));
      if (tagRows.length) {
        await db
          .insert(articleTags)
          .values(tagRows.map((t) => ({ articleId: created.id, tagId: t.id })))
          .onConflictDoNothing();
      }
    }

    return NextResponse.json(serializeArticle(created), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
