import { NextResponse } from "next/server";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const EXT_DIR = path.join(process.cwd(), "chrome-extension");

async function addFilesFromDir(zip: JSZip, dir: string, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const zipPath  = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      await addFilesFromDir(zip, fullPath, zipPath);
    } else {
      const buf = fs.readFileSync(fullPath);
      zip.file(zipPath, buf);
    }
  }
}

export async function GET() {
  if (!fs.existsSync(EXT_DIR)) {
    return NextResponse.json({ error: "Extension not found" }, { status: 404 });
  }

  const zip = new JSZip();
  const folder = zip.folder("challenge-funnel-extension")!;
  await addFilesFromDir(folder as unknown as JSZip, EXT_DIR);

  const buf  = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: "application/zip" });

  return new Response(blob, {
    status: 200,
    headers: {
      "Content-Type":        "application/zip",
      "Content-Disposition": 'attachment; filename="challenge-funnel-extension.zip"',
      "Content-Length":      String(buf.byteLength),
    },
  });
}
