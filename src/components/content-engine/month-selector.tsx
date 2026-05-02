"use client";

import { Check } from "lucide-react";

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

function getMonthLabel(yyyyMM: string): string {
  const [yearStr, monthStr] = yyyyMM.split("-");
  const month = parseInt(monthStr, 10);
  return `${MONTH_NAMES[month - 1]} ${yearStr}`;
}

function getMonthsToShow(): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let offset = -3; offset <= 1; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${d.getFullYear()}-${mm}`);
  }
  return months;
}

interface MonthSelectorProps {
  activeMonth: string;
  generatedMonths: Set<string>;
  onChange: (month: string) => void;
}

export function MonthSelector({ activeMonth, generatedMonths, onChange }: MonthSelectorProps) {
  const months = getMonthsToShow();
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {months.map((month) => {
        const isActive    = month === activeMonth;
        const isGenerated = generatedMonths.has(month);
        const isCurrent   = month === currentMonth;

        return (
          <button
            key={month}
            onClick={() => onChange(month)}
            className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 text-left transition-all ${
              isActive
                ? "border-brand-300 bg-brand-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className={`text-sm font-semibold ${isActive ? "text-brand-700" : "text-gray-700"}`}>
              {getMonthLabel(month)}
            </span>
            <div className="mt-1.5 flex items-center gap-1">
              {isCurrent && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                  This month
                </span>
              )}
              {isGenerated ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <Check className="h-2.5 w-2.5" /> Ready
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                  Not generated
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
