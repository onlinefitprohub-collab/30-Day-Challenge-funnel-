import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { notion_api_key, notion_page_id } = await req.json() as {
    notion_api_key?: string;
    notion_page_id?: string;
  };

  if (!notion_api_key || !notion_page_id) {
    return NextResponse.json({ error: "Both fields are required" }, { status: 400 });
  }

  // Test the credentials against the Notion API before saving
  const res = await fetch(`https://api.notion.com/v1/pages/${notion_page_id.replace(/-/g, "")}`, {
    headers: {
      Authorization: `Bearer ${notion_api_key}`,
      "Notion-Version": "2022-06-28",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string; code?: string };
    if (res.status === 401) {
      return NextResponse.json({ error: "Invalid integration token — check it starts with secret_" }, { status: 422 });
    }
    if (res.status === 404) {
      return NextResponse.json({ error: "Page not found — make sure you've shared the page with your integration" }, { status: 422 });
    }
    return NextResponse.json({ error: body.message ?? `Notion API error ${res.status}` }, { status: 422 });
  }

  const page = await res.json() as { url?: string };

  const { error } = await supabase.from("user_settings").upsert(
    { user_id: user.id, notion_api_key, notion_page_id },
    { onConflict: "user_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, pageUrl: page.url });
}
