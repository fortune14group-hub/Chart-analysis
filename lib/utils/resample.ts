import { Series } from "@/lib/types";

const INTERVAL_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 5 * 60_000,
  "1h": 60 * 60_000,
  "1d": 24 * 60 * 60_000,
  "1w": 7 * 24 * 60 * 60_000
};

export function resampleSeries(series: Series, interval: keyof typeof INTERVAL_MS): Series {
  if (!series.length) return [];
  const sorted = [...series].sort((a, b) => (a.t > b.t ? 1 : -1));
  const parsed = sorted.map((d) => Date.parse(d.t));
  const hasInvalid = parsed.some((v) => Number.isNaN(v));
  if (hasInvalid) {
    // fallback to sequential timestamps using provided interval
    const start = Date.now() - (sorted.length - 1) * INTERVAL_MS[interval];
    return sorted.map((d, idx) => ({ ...fillOHLC(d), t: new Date(start + idx * INTERVAL_MS[interval]).toISOString() }));
  }
  const start = parsed[0];
  const step = INTERVAL_MS[interval] ?? INTERVAL_MS["1h"];
  return sorted.map((d, idx) => ({ ...fillOHLC(d), t: new Date(start + idx * step).toISOString() }));
}

function fillOHLC(candle: { t: string; o?: number; h?: number; l?: number; c: number; v?: number }) {
  const c = Number(candle.c);
  const o = candle.o ?? c;
  const h = candle.h ?? Math.max(o, c);
  const l = candle.l ?? Math.min(o, c);
  return { ...candle, o, h, l, c };
}
