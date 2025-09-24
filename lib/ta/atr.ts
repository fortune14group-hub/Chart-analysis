import { Series } from "@/lib/types";

export function atr(series: Series, period = 14): (number | null)[] {
  const result: (number | null)[] = new Array(series.length).fill(null);
  if (series.length <= 1) return result;

  const trs: number[] = [];
  for (let i = 0; i < series.length; i += 1) {
    const candle = series[i];
    const prevClose = i > 0 ? series[i - 1].c : candle.c;
    const tr = Math.max(
      (candle.h ?? candle.c) - (candle.l ?? candle.c),
      Math.abs((candle.h ?? candle.c) - prevClose),
      Math.abs((candle.l ?? candle.c) - prevClose)
    );
    trs.push(tr);
  }

  let sum = 0;
  for (let i = 0; i < trs.length; i += 1) {
    sum += trs[i];
    if (i >= period) {
      sum -= trs[i - period];
    }
    if (i >= period - 1) {
      result[i] = sum / period;
    }
  }

  return result;
}
