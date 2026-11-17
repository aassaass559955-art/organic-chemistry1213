import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { articles, books, downloads } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get("article");
  const bookId = req.nextUrl.searchParams.get("book");
  const fileIdx = parseInt(req.nextUrl.searchParams.get("file") || "0", 10);

  try {
    if (articleId) {
      const rows = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
      const article = rows[0];
      if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const att = article.attachments[fileIdx];
      if (!att) return NextResponse.json({ error: "File not found" }, { status: 404 });
      await db.update(articles).set({ downloads: sql`${articles.downloads} + 1` }).where(eq(articles.id, articleId));
      await db.insert(downloads).values({ articleId, file: att.name });
      const target = att.url.startsWith("http") ? att.url : new URL(att.url, req.nextUrl.origin).toString();
      return NextResponse.redirect(target);
    }
    if (bookId) {
      const rows = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
      const book = rows[0];
      if (!book || !book.fileUrl) return NextResponse.json({ error: "Not found" }, { status: 404 });
      await db.update(books).set({ downloads: sql`${books.downloads} + 1` }).where(eq(books.id, bookId));
      await db.insert(downloads).values({ bookId, file: book.titleAr });
      const target = book.fileUrl.startsWith("http") ? book.fileUrl : new URL(book.fileUrl, req.nextUrl.origin).toString();
      return NextResponse.redirect(target);
    }
    return NextResponse.json({ error: "Missing target" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
