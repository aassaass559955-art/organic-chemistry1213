import { NextResponse } from "next/server";
import { listCategories, listTags } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);
  return NextResponse.json({ categories, tags });
}
