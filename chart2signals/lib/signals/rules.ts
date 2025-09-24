import { IndicatorOptions, Series, Signal } from "@/lib/types";
import { IndicatorResult } from "@/lib/ta";
import { sma } from "@/lib/ta/sma";

export type SignalContext = {
  series: Series;
  indicators: IndicatorResult;
  options: IndicatorOptions;
};

export function generateSignals({ series, indicators, options }: SignalContext): Signal[] {
  const signals: Signal[] = [];
  const closes = indicators.closes;
  const volumeSma = indicators.volumeSma20 ?? (series.some((c) => c.v != null) ? sma(series.map((c) => c.v ?? 0), 20) : undefined);

  let touchedLower = false;
  let touchedUpper = false;

  for (let i = 1; i < series.length; i += 1) {
    const reasons: string[] = [];
    const candle = series[i];

    // Trend cross
    if (options.sma20 && options.sma50 && indicators.sma20 && indicators.sma50) {
      const prevDiff = diff(indicators.sma20[i - 1], indicators.sma50[i - 1]);
      const currDiff = diff(indicators.sma20[i], indicators.sma50[i]);
      if (prevDiff != null && currDiff != null) {
        if (prevDiff <= 0 && currDiff > 0) {
          reasons.push("SMA20 korsar upp SMA50");
          signals.push(buildSignal("BUY", reasons, candle.c, candle.t, i, volumeBoost(series[i], volumeSma?.[i])));
          continue;
        }
        if (prevDiff >= 0 && currDiff < 0) {
          reasons.push("SMA20 korsar ned SMA50");
          signals.push(buildSignal("SELL", reasons, candle.c, candle.t, i, volumeBoost(series[i], volumeSma?.[i])));
          continue;
        }
      }
    }

    // MACD crosses
    if (options.macd && indicators.macd) {
      const macdLine = indicators.macd.macd;
      const signalLine = indicators.macd.signal;
      const prevDiff = diff(macdLine[i - 1], signalLine[i - 1]);
      const currDiff = diff(macdLine[i], signalLine[i]);
      if (prevDiff != null && currDiff != null && macdLine[i] != null) {
        if (prevDiff <= 0 && currDiff > 0 && (macdLine[i] as number) < 0) {
          reasons.push("MACD bullish cross under noll");
          signals.push(buildSignal("BUY", reasons, candle.c, candle.t, i, volumeBoost(series[i], volumeSma?.[i])));
          continue;
        }
        if (prevDiff >= 0 && currDiff < 0 && (macdLine[i] as number) > 0) {
          reasons.push("MACD bearish cross över noll");
          signals.push(buildSignal("SELL", reasons, candle.c, candle.t, i, volumeBoost(series[i], volumeSma?.[i])));
          continue;
        }
      }
    }

    // RSI reversals
    if (options.rsi14 && indicators.rsi14) {
      const prevRsi = indicators.rsi14[i - 1];
      const currRsi = indicators.rsi14[i];
      if (prevRsi != null && currRsi != null) {
        if (prevRsi < 30 && currRsi > prevRsi) {
          reasons.push("RSI rekylerar upp från översåld");
          signals.push(buildSignal("BUY", reasons, candle.c, candle.t, i, volumeBoost(series[i], volumeSma?.[i])));
          continue;
        }
        if (prevRsi > 70 && currRsi < prevRsi) {
          reasons.push("RSI vänder ned från överköpt");
          signals.push(buildSignal("SELL", reasons, candle.c, candle.t, i, volumeBoost(series[i], volumeSma?.[i])));
          continue;
        }
      }
    }

    // Bollinger middle re-entry
    if (options.boll20 && indicators.boll20) {
      const { lower, upper, middle } = indicators.boll20;
      const prevClose = closes[i - 1];
      const currClose = closes[i];
      const prevLower = lower[i - 1];
      const prevUpper = upper[i - 1];
      const currMiddle = middle[i];
      if (prevLower != null && prevUpper != null && currMiddle != null) {
        if (prevClose <= prevLower) touchedLower = true;
        if (prevClose >= prevUpper) touchedUpper = true;
        if (touchedLower && currClose >= currMiddle) {
          reasons.push("Bollinger återtag mittband (nedre)");
          signals.push(buildSignal("BUY", reasons, candle.c, candle.t, i, volumeBoost(series[i], volumeSma?.[i])));
          touchedLower = false;
          continue;
        }
        if (touchedUpper && currClose <= currMiddle) {
          reasons.push("Bollinger återtag mittband (övre)");
          signals.push(buildSignal("SELL", reasons, candle.c, candle.t, i, volumeBoost(series[i], volumeSma?.[i])));
          touchedUpper = false;
          continue;
        }
      }
    }
  }

  return mergeSignals(signals);
}

function diff(a: number | null | undefined, b: number | null | undefined) {
  if (a == null || b == null) return null;
  return a - b;
}

function volumeBoost(candle: { v?: number }, volumeSma?: number | null) {
  if (candle.v == null || volumeSma == null) return 0;
  return candle.v > volumeSma ? 0.15 : 0;
}

function buildSignal(
  type: Signal["type"],
  reasons: string[],
  price: number,
  timestamp: string,
  index: number,
  volumeBonus: number
): Signal {
  const uniqueReasons = Array.from(new Set(reasons));
  const baseConfidence = Math.min(1, uniqueReasons.length / 4 + volumeBonus);
  return {
    type,
    reason: uniqueReasons,
    price,
    timestamp,
    index,
    confidence: Number(baseConfidence.toFixed(2))
  };
}

function mergeSignals(signals: Signal[]): Signal[] {
  // combine signals on same index by concatenating reasons
  const byIndex = new Map<number, Signal>();
  for (const sig of signals) {
    const existing = byIndex.get(sig.index);
    if (!existing) {
      byIndex.set(sig.index, { ...sig });
      continue;
    }
    const type = existing.type === "BUY" && sig.type === "SELL" ? (sig.confidence > existing.confidence ? sig.type : existing.type) : existing.type;
    const combined: Signal = {
      ...existing,
      type,
      reason: Array.from(new Set([...existing.reason, ...sig.reason])),
      confidence: Math.min(1, Math.max(existing.confidence, sig.confidence))
    };
    byIndex.set(sig.index, combined);
  }
  return Array.from(byIndex.values()).sort((a, b) => a.index - b.index);
}
