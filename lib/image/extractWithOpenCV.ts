import { Series } from "@/lib/types";
import { ensureOHLC } from "@/lib/utils/normalize";

export async function extractWithOpenCV(
  buffer: Buffer,
  resolution: "1m" | "5m" | "1h" | "1d" | "1w" = "1h"
): Promise<{ series: Series; meta: { kind: "line"; interval: typeof resolution } }> {
  try {
    const bytes = new Uint8Array(buffer);
    if (!bytes.length) throw new Error("empty-buffer");

    const sampleCount = Math.min(400, Math.max(80, Math.floor(bytes.length / 24)));
    const step = Math.max(1, Math.floor(bytes.length / sampleCount));
    const samples: number[] = [];
    for (let i = 0; i < bytes.length; i += step) {
      const window = bytes.subarray(i, i + step);
      if (!window.length) continue;
      let min = 255;
      let max = 0;
      for (const value of window) {
        if (value < min) min = value;
        if (value > max) max = value;
      }
      samples.push((min + max) / 2);
      if (samples.length >= sampleCount) break;
    }

    if (!samples.length) throw new Error("no-samples");

    const minValue = Math.min(...samples);
    const maxValue = Math.max(...samples);
    const span = maxValue - minValue || 1;
    const base = 100;
    const range = 50;

    const now = Date.now();
    const intervalMs: Record<typeof resolution, number> = {
      "1m": 60_000,
      "5m": 5 * 60_000,
      "1h": 60 * 60_000,
      "1d": 24 * 60 * 60_000,
      "1w": 7 * 24 * 60 * 60_000
    };

    const series: Series = samples.map((sample, idx) => {
      const normalized = (sample - minValue) / span;
      const price = base + (1 - normalized) * range;
      const ts = new Date(now - (samples.length - idx) * intervalMs[resolution]).toISOString();
      return { t: ts, c: Number(price.toFixed(2)) };
    });

    return { series: ensureOHLC(series), meta: { kind: "line", interval: resolution } };
  } catch (error) {
    throw new Error(`Heuristisk extraktion misslyckades: ${(error as Error).message}`);
  }
}
