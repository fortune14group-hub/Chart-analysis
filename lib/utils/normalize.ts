import { Candle, Series } from "@/lib/types";

export function ensureOHLC(series: Series): Series {
  return series.map((candle) => normalizeCandle(candle));
}

export function normalizeCandle(candle: Candle): Candle {
  const close = Number(candle.c);
  const open = candle.o != null ? Number(candle.o) : close;
  const high = candle.h != null ? Number(candle.h) : Math.max(open, close);
  const low = candle.l != null ? Number(candle.l) : Math.min(open, close);
  const volume = candle.v != null ? Number(candle.v) : undefined;
  return { ...candle, o: open, h: high, l: low, c: close, v: volume };
}

export function sanitizeSeries(series: Series): Series {
  return ensureOHLC(series.filter((item) => Number.isFinite(Number(item.c))));
}
