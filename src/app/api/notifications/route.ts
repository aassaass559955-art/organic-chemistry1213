import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(8);
  return NextResponse.json(
    rows.map((n) => ({
      id: n.id,
      titleAr: n.titleAr,
      titleEn: n.titleEn,
      bodyAr: n.bodyAr,
      bodyEn: n.bodyEn,
      createdAt: n.createdAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const titleAr = String(body.titleAr || "").trim();
    if (!titleAr) return NextResponse.json({ error: "Title required" }, { status: 400 });
    const [created] = await db
      .insert(notifications)
      .values({
        titleAr: titleAr.slice(0, 200),
        titleEn: String(body.titleEn || "").slice(0, 200),
        bodyAr: String(body.bodyAr || "").slice(0, 1000),
        bodyEn: String(body.bodyEn || "").slice(0, 1000),
      })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
