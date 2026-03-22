"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ResultSectionProps {
  title: string;
  content: string;
  children?: React.ReactNode;
}

export function ResultSection({ title, content, children }: ResultSectionProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast({ title: "Copied!", description: `${title} copied to clipboard.` });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="p-5">
        {children ?? <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{content}</p>}
      </div>
    </div>
  );
}

interface CopyableItemProps {
  label?: string;
  value: string;
  className?: string;
}

export function CopyableItem({ label, value, className }: CopyableItemProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`group relative rounded-lg border border-gray-100 bg-gray-50 p-3 ${className}`}>
      {label && <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>}
      <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{value}</p>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-200"
        title="Copy"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
    </div>
  );
}
