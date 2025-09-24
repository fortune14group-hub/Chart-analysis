import { Series, IndicatorOptions } from "@/lib/types";
import { sma } from "@/lib/ta/sma";
import { ema } from "@/lib/ta/ema";
import { rsi } from "@/lib/ta/rsi";
import { macd } from "@/lib/ta/macd";
import { bollinger } from "@/lib/ta/bollinger";
import { atr } from "@/lib/ta/atr";

export type IndicatorResult = {
  closes: number[];
  sma20?: (number | null)[];
  sma50?: (number | null)[];
  ema9?: (number | null)[];
  ema21?: (number | null)[];
  rsi14?: (number | null)[];
  macd?: ReturnType<typeof macd>;
  boll20?: ReturnType<typeof bollinger>;
  atr14: (number | null)[];
  volumeSma20?: (number | null)[];
};

export function computeIndicators(series: Series, options: IndicatorOptions): IndicatorResult {
  const closes = series.map((c) => c.c);
  const volumes = series.map((c) => c.v ?? 0);
  const indicatorResult: IndicatorResult = {
    closes,
    atr14: atr(series, 14)
  };

  if (options.sma20) indicatorResult.sma20 = sma(closes, 20);
  if (options.sma50) indicatorResult.sma50 = sma(closes, 50);
  if (options.ema9) indicatorResult.ema9 = ema(closes, 9);
  if (options.ema21) indicatorResult.ema21 = ema(closes, 21);
  if (options.rsi14) indicatorResult.rsi14 = rsi(closes, 14);
  if (options.macd) indicatorResult.macd = macd(closes, 12, 26, 9);
  if (options.boll20) indicatorResult.boll20 = bollinger(closes, 20, 2);
  if (series.some((c) => c.v != null)) indicatorResult.volumeSma20 = sma(volumes, 20);

  return indicatorResult;
}
