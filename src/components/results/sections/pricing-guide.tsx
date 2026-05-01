"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, DollarSign, CheckCircle2 } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";

interface ValueStackItem {
  item: string;
  perceivedValue: string;
  description: string;
}

interface ObjectionHandler {
  objection: string;
  response: string;
}

interface PricingGuide {
  recommendedPrice: string;
  priceRange: { min: string; max: string };
  rationale: string;
  valueStack: ValueStackItem[];
  positioningStatement: string;
  confidenceScript: string;
  objectionHandlers: ObjectionHandler[];
  nextSteps: string[];
}

export function PricingGuideSection({ data }: { data: PricingGuide }) {
  const [openObjections, setOpenObjections] = useState<Set<number>>(new Set());
  const [copiedPositioning, setCopiedPositioning] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  function toggleObjection(idx: number) {
    setOpenObjections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function toggleExpandAll() {
    if (openObjections.size < data.objectionHandlers.length) {
      setOpenObjections(new Set(data.objectionHandlers.map((_, i) => i)));
    } else {
      setOpenObjections(new Set());
    }
  }

  async function handleCopyPositioning() {
    await navigator.clipboard.writeText(data.positioningStatement);
    setCopiedPositioning(true);
    toast({ title: "Positioning statement copied!" });
    setTimeout(() => setCopiedPositioning(false), 2000);
  }

  async function handleCopyScript() {
    await navigator.clipboard.writeText(data.confidenceScript);
    setCopiedScript(true);
    toast({ title: "Confidence script copied!" });
    setTimeout(() => setCopiedScript(false), 2000);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        AI-generated pricing guide — recommended price, value stack, positioning, objection handlers, and next steps.
      </p>

      {/* Hero card — price + rationale */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100">
              <DollarSign className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 mb-0.5">
                Recommended Price
              </p>
              <p className="text-4xl font-bold text-gray-900 leading-none">{data.recommendedPrice}</p>
              <p className="mt-1 text-xs text-gray-500">
                Range: {data.priceRange.min} – {data.priceRange.max}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-brand-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 mb-1.5">Rationale</p>
          <p className="text-sm leading-relaxed text-gray-800">{data.rationale}</p>
        </div>
      </div>

      {/* Value Stack table */}
      <div>
        <div className="flex items-center gap-2 pt-1 mb-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700">
            Value Stack
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-1/3">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-1/5">
                  Perceived Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.valueStack.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.item}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap">{row.perceivedValue}</td>
                  <td className="px-4 py-3 text-gray-600 leading-relaxed">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Positioning Statement */}
      <div>
        <div className="flex items-center gap-2 pt-1 mb-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700">
            Positioning Statement
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <button
            onClick={handleCopyPositioning}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedPositioning
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy</>
            }
          </button>
        </div>
        <CopyableItem value={data.positioningStatement} />
      </div>

      {/* Confidence Script */}
      <div>
        <div className="flex items-center gap-2 pt-1 mb-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700">
            Confidence Script
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <button
            onClick={handleCopyScript}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedScript
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy</>
            }
          </button>
        </div>
        <CopyableItem value={data.confidenceScript} />
      </div>

      {/* Objection Handlers */}
      <div>
        <div className="flex items-center gap-2 pt-1 mb-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700">
            Objection Handlers
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <button
            onClick={toggleExpandAll}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {openObjections.size < data.objectionHandlers.length ? "Expand all" : "Collapse all"}
          </button>
        </div>
        <div className="space-y-2">
          {data.objectionHandlers.map((handler, i) => {
            const isOpen = openObjections.has(i);
            return (
              <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => toggleObjection(i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {isOpen
                      ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    }
                    <p className="font-semibold text-gray-900 text-sm">{handler.objection}</p>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Response</p>
                    <CopyableItem value={handler.response} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps checklist */}
      <div>
        <div className="flex items-center gap-2 pt-1 mb-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700">
            Next Steps
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <ol className="space-y-3">
            {data.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-800">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
