import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

const ALLOWED: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".zip": "application/zip",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function safeName(name: string) {
  const base = path.basename(name).replace(/[^\w.\-\u0600-\u06FF]+/g, "_");
  return base.slice(0, 90) || "file";
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 413 });
    }
    const ext = path.extname(file.name).toLowerCase();
    const mime = ALLOWED[ext];
    if (!mime) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    // Basic magic-byte sanity for PDFs/zip-based formats
    const head = buffer.subarray(0, 4).toString("latin1");
    if (ext === ".pdf" && !head.startsWith("%PDF")) {
      return NextResponse.json({ error: "Invalid PDF file" }, { status: 415 });
    }
    if ((ext === ".zip" || ext === ".docx" || ext === ".pptx") && !head.startsWith("PK")) {
      return NextResponse.json({ error: "Invalid archive file" }, { status: 415 });
    }
    const filename = `${Date.now()}-${safeName(file.name)}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({
      name: file.name,
      url: `/uploads/${filename}`,
      size: file.size,
      mime,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
