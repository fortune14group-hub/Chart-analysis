import { ema } from "@/lib/ta/ema";

export function macd(values: number[], fast = 12, slow = 26, signalPeriod = 9) {
  const fastEma = ema(values, fast);
  const slowEma = ema(values, slow);
  const macdLine: (number | null)[] = values.map((_, i) => {
    const fastVal = fastEma[i];
    const slowVal = slowEma[i];
    if (fastVal == null || slowVal == null) return null;
    return fastVal - slowVal;
  });
  const macdValues = macdLine.map((v) => (v ?? 0));
  const signalLine = ema(macdValues, signalPeriod).map((v, i) => (macdLine[i] == null ? null : v));
  const histogram = macdLine.map((v, i) => (v == null || signalLine[i] == null ? null : v - (signalLine[i] as number)));
  return { macd: macdLine, signal: signalLine, histogram };
}
