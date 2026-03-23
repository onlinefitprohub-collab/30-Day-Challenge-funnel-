import { NextResponse } from "next/server";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const EXT_DIR = path.join(process.cwd(), "chrome-extension");

function addDir(zip: JSZip, dir: string, prefix: string) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full    = path.join(dir, entry.name);
    const zipPath = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      addDir(zip, full, zipPath);
    } else {
      zip.file(zipPath, fs.readFileSync(full));
    }
  }
}

export async function GET() {
  if (!fs.existsSync(EXT_DIR)) {
    return NextResponse.json({ error: "Extension not found" }, { status: 404 });
  }

  const zip = new JSZip();
  addDir(zip, EXT_DIR, "challenge-funnel-extension");

  const buf          = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const arrayBuffer  = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;

  return new Response(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type":        "application/zip",
      "Content-Disposition": 'attachment; filename="challenge-funnel-extension.zip"',
      "Content-Length":      String(buf.byteLength),
    },
  });
}
