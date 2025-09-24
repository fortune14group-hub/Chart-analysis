"use client";

import { sv } from "@/lib/i18n/sv";

const INDICATORS: { key: string; label: string }[] = [
  { key: "sma20", label: sv.indicators.sma20 },
  { key: "sma50", label: sv.indicators.sma50 },
  { key: "ema9", label: sv.indicators.ema9 },
  { key: "ema21", label: sv.indicators.ema21 },
  { key: "rsi14", label: sv.indicators.rsi14 },
  { key: "macd", label: sv.indicators.macd },
  { key: "boll20", label: sv.indicators.boll20 }
];

export default function IndicatorToggles() {
  return (
    <fieldset className="space-y-3 rounded-2xl border bg-card/50 p-4">
      <legend className="text-sm font-medium">{sv.indicators.title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {INDICATORS.map((indicator) => (
          <label key={indicator.key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={indicator.key}
              defaultChecked={["sma20", "sma50", "macd", "rsi14", "boll20"].includes(indicator.key)}
              className="size-4 rounded border-border bg-background"
            />
            <span>{indicator.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
