import { describe, it, expect } from "vitest";
import { generateSignals } from "@/lib/signals/rules";
import { applyRiskManagement } from "@/lib/signals/risk";
import { computeIndicators } from "@/lib/ta";
import type { IndicatorOptions, Series } from "@/lib/types";

describe("signal generation", () => {
  it("creates BUY signal on RSI reversal", () => {
    const series: Series = [];
    let value = 100;
    for (let i = 0; i < 25; i += 1) {
      value -= 1.2;
      series.push({ t: `2024-01-01T00:${String(i).padStart(2, "0")}:00Z`, o: value + 0.3, h: value + 0.5, l: value - 0.5, c: value });
    }
    for (let i = 25; i < 45; i += 1) {
      value += 1.6;
      series.push({ t: `2024-01-01T00:${String(i).padStart(2, "0")}:00Z`, o: value - 0.3, h: value + 0.5, l: value - 0.8, c: value });
    }

    const options: IndicatorOptions = { sma20: true, sma50: true, rsi14: true, macd: true, boll20: true };
    const indicators = computeIndicators(series, options);
    const signals = generateSignals({ series, indicators, options });
    expect(signals.some((s) => s.type === "BUY")).toBe(true);

    const enriched = applyRiskManagement(signals, indicators.atr14);
    const withStops = enriched.find((s) => s.stopLoss != null && s.takeProfit != null);
    expect(withStops).toBeDefined();
    expect(withStops?.stopLoss).not.toBeUndefined();
  });
});
