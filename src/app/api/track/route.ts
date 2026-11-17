import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { stats } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await db
      .insert(stats)
      .values({ key: "visitors", value: 1 })
      .onConflictDoUpdate({ target: stats.key, set: { value: sql`${stats.value} + 1` } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
