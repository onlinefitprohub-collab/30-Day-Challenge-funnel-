import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY ?? "";
  return NextResponse.json({
    ANTHROPIC_API_KEY_present: !!key,
    ANTHROPIC_API_KEY_length:  key.length,
    ANTHROPIC_API_KEY_prefix:  key.slice(0, 14) || "(empty)",
    NODE_ENV: process.env.NODE_ENV,
  });
}
