import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMarkdown } from "@/lib/export/generate-markdown";
import type { GeneratedFunnelAssets } from "@/types/generation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

type NotionBlock =
  | { object: "block"; type: "heading_2"; heading_2: { rich_text: [{ type: "text"; text: { content: string } }] } }
  | { object: "block"; type: "paragraph"; paragraph: { rich_text: [{ type: "text"; text: { content: string } }] } }
  | { object: "block"; type: "divider"; divider: Record<string, never> };

function textBlock(content: string): NotionBlock {
  return { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: content.slice(0, 2000) } }] } };
}

function textBlocks(content: string): NotionBlock[] {
  if (content.length <= 2000) return [textBlock(content)];
  const chunks: NotionBlock[] = [];
  for (let i = 0; i < content.length; i += 2000) {
    chunks.push(textBlock(content.slice(i, i + 2000)));
  }
  return chunks;
}
function h2Block(content: string): NotionBlock {
  return { object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content } }] } };
}
function divider(): NotionBlock {
  return { object: "block", type: "divider", divider: {} };
}

function markdownToBlocks(md: string): NotionBlock[] {
  const blocks: NotionBlock[] = [];
  const lines = md.split("\n");
  for (const line of lines) {
    if (line.startsWith("## ")) {
      blocks.push(h2Block(line.slice(3)));
    } else if (line.startsWith("---")) {
      blocks.push(divider());
    } else if (line.trim()) {
      // Strip markdown bold/italic/list markers for cleaner Notion output
      const clean = line.replace(/^\*\*(.+?)\*\*$/, "$1").replace(/^- /, "• ").replace(/^> /, "");
      blocks.push(...textBlocks(clean));
    }
  }
  return blocks;
}

async function createNotionPage(
  apiKey: string,
  parentPageId: string,
  title: string,
  blocks: NotionBlock[],
): Promise<{ url?: string; id?: string; error?: string }> {
  // Notion API max 100 children per request
  const firstBatch = blocks.slice(0, 100);

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { page_id: parentPageId.replace(/-/g, "") },
      properties: {
        title: { title: [{ type: "text", text: { content: title } }] },
      },
      children: firstBatch,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    return { error: err.message ?? `Notion API error ${res.status}` };
  }

  const data = await res.json() as { id?: string; url?: string };
  const pageId = data.id;

  // Append remaining blocks in batches of 100
  if (pageId && blocks.length > 100) {
    for (let i = 100; i < blocks.length; i += 100) {
      const batch = blocks.slice(i, i + 100);
      await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({ children: batch }),
      });
    }
  }

  return { id: pageId, url: data.url };
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get Notion credentials
  const { data: settings } = await supabase
    .from("user_settings")
    .select("notion_api_key, notion_page_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const s = settings as { notion_api_key?: string | null; notion_page_id?: string | null } | null;
  if (!s?.notion_api_key || !s?.notion_page_id) {
    return NextResponse.json(
      { error: "Notion API key and page ID required. Add them in Account Settings." },
      { status: 422 }
    );
  }

  // Verify project ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id, name")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const { data: outputData } = await supabase
    .from("project_outputs")
    .select("outputs")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!outputData?.outputs) return NextResponse.json({ error: "No outputs found" }, { status: 404 });

  const assets = outputData.outputs as unknown as GeneratedFunnelAssets;
  const markdown = generateMarkdown(assets, project.name);
  const blocks = markdownToBlocks(markdown);

  const result = await createNotionPage(
    s.notion_api_key,
    s.notion_page_id,
    `${project.name} — Funnel Copy`,
    blocks,
  );

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ url: result.url, pageId: result.id });
}
