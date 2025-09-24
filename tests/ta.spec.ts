import { describe, it, expect } from "vitest";
import { sma } from "@/lib/ta/sma";
import { ema } from "@/lib/ta/ema";
import { rsi } from "@/lib/ta/rsi";
import { macd } from "@/lib/ta/macd";
import { bollinger } from "@/lib/ta/bollinger";
import { atr } from "@/lib/ta/atr";
import type { Series } from "@/lib/types";

describe("technical indicators", () => {
  it("calculates SMA correctly", () => {
    const values = [1, 2, 3, 4, 5];
    expect(sma(values, 3)).toEqual([null, null, 2, 3, 4]);
  });

  it("calculates EMA with smoothing", () => {
    const values = [10, 11, 12, 13, 14, 15];
    const result = ema(values, 3);
    expect(result[2]).toBeCloseTo(11);
    expect(result.at(-1) ?? 0).toBeGreaterThan(14);
  });

  it("computes RSI", () => {
    const values = [45.15, 46.23, 45.78, 45.12, 44.8, 45.9, 46.2, 46.5, 47.2, 46.7, 47.9, 48.3, 48.7, 49.1, 49.5];
    const result = rsi(values, 14);
    expect(result.at(-1)).toBeGreaterThan(60);
  });

  it("computes MACD components", () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const { macd: line, signal, histogram } = macd(values, 3, 6, 3);
    expect(line.filter((v) => v != null).length).toBeGreaterThan(0);
    expect(signal.filter((v) => v != null).length).toBeGreaterThan(0);
    expect(histogram.filter((v) => v != null).length).toBeGreaterThan(0);
  });

  it("computes Bollinger bands", () => {
    const values = Array.from({ length: 30 }, (_, i) => 100 + i);
    const bands = bollinger(values, 5, 2);
    expect(bands.middle.at(-1)).toBeCloseTo(124);
    expect(bands.upper.at(-1)).toBeGreaterThan(bands.middle.at(-1) ?? 0);
    expect(bands.lower.at(-1)).toBeLessThan(bands.middle.at(-1) ?? 0);
  });

  it("computes ATR", () => {
    const series: Series = [
      { t: "0", o: 10, h: 12, l: 9, c: 11 },
      { t: "1", o: 11, h: 13, l: 10, c: 12 },
      { t: "2", o: 12, h: 14, l: 11, c: 13 },
      { t: "3", o: 13, h: 15, l: 12, c: 14 }
    ];
    const result = atr(series, 3);
    expect(result.at(-1)).toBeGreaterThan(2);
  });
});
