import { Series, Candle } from "@/lib/types";
import { normalizeCandle } from "@/lib/utils/normalize";

export function parseCsv(text: string): Series {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return [];

  const header = lines[0].split(/[,;\t]/).map((h) => h.trim().toLowerCase());
  const hasHeader = header.includes("t") || header.includes("time") || header.includes("c");
  const entries = hasHeader ? lines.slice(1) : lines;

  const getIndex = (key: string) => header.findIndex((h) => h.startsWith(key));
  const idxT = getIndex("t") !== -1 ? getIndex("t") : getIndex("time");
  const idxO = getIndex("o");
  const idxH = getIndex("h");
  const idxL = getIndex("l");
  const idxC = getIndex("c");
  const idxV = getIndex("v");

  return entries
    .map((line) => line.split(/[,;\t]/))
    .map((cols, index) => {
      const record: Candle = {
        t: String(idxT != null && idxT >= 0 ? cols[idxT] : index),
        c: Number(cols[idxC >= 0 ? idxC : cols.length - 1])
      };
      if (idxO != null && idxO >= 0) record.o = Number(cols[idxO]);
      if (idxH != null && idxH >= 0) record.h = Number(cols[idxH]);
      if (idxL != null && idxL >= 0) record.l = Number(cols[idxL]);
      if (idxV != null && idxV >= 0) record.v = Number(cols[idxV]);
      return normalizeCandle(record);
    })
    .filter((row) => Number.isFinite(row.c));
}

export function seriesToCsv(series: Series): string {
  const header = "t,o,h,l,c,v";
  const rows = series.map((candle) => [
    candle.t,
    candle.o ?? candle.c,
    candle.h ?? candle.c,
    candle.l ?? candle.c,
    candle.c,
    candle.v ?? ""
  ]);
  return [header, ...rows.map((r) => r.join(","))].join("\n");
}

export function signalsToCsv(signals: { timestamp: string; type: string; price: number; confidence: number; reason: string[] }[]): string {
  const header = "timestamp,type,price,confidence,reason";
  return [header, ...signals.map((s) => [s.timestamp, s.type, s.price, s.confidence.toFixed(2), s.reason.join(" | ")].join(","))].join("\n");
}
