import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.createdAt));
  return NextResponse.json(rows.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })));
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const role = String(body.role || "");
    if (!id || !["ADMIN", "EDITOR", "USER"].includes(role)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    if (id === session.sub) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }
    await db.update(users).set({ role: role as "ADMIN" | "EDITOR" | "USER" }).where(eq(users.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
