import { Series } from "@/lib/types";
import { ensureOHLC } from "@/lib/utils/normalize";
import { PNG } from "pngjs";
import jpeg from "jpeg-js";

function decodeImage(buffer: Buffer): { width: number; height: number; data: Uint8Array } {
  const header = buffer.subarray(0, 8).toString("hex");
  if (header.startsWith("89504e47")) {
    const png = PNG.sync.read(buffer);
    return { width: png.width, height: png.height, data: png.data };
  }
  const jpg = jpeg.decode(buffer, { useTArray: true, formatAsRGBA: true });
  return { width: jpg.width, height: jpg.height, data: jpg.data };
}

export async function extractWithOpenCV(
  buffer: Buffer,
  resolution: "1m" | "5m" | "1h" | "1d" | "1w" = "1h"
): Promise<{ series: Series; meta: { kind: "line"; interval: typeof resolution } }> {
  try {
    const decoded = decodeImage(buffer);
    const step = Math.max(1, Math.floor(decoded.width / 400));
    const points: { x: number; y: number }[] = [];
    for (let x = 0; x < decoded.width; x += step) {
      let bestY = 0;
      let bestScore = Infinity;
      for (let y = 0; y < decoded.height; y += 1) {
        const idx = (y * decoded.width + x) * 4;
        const r = decoded.data[idx];
        const g = decoded.data[idx + 1];
        const b = decoded.data[idx + 2];
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        if (brightness < bestScore) {
          bestScore = brightness;
          bestY = y;
        }
      }
      points.push({ x, y: decoded.height - bestY });
    }

    if (!points.length) throw new Error("no-points");

    const ys = points.map((p) => p.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const span = maxY - minY || 1;
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

    const series: Series = points.map((point, idx) => {
      const normalized = (point.y - minY) / span;
      const price = base + (1 - normalized) * range;
      const ts = new Date(now - (points.length - idx) * intervalMs[resolution]).toISOString();
      return { t: ts, c: Number(price.toFixed(2)) };
    });

    return { series: ensureOHLC(series), meta: { kind: "line", interval: resolution } };
  } catch (error) {
    throw new Error(`Heuristisk extraktion misslyckades: ${(error as Error).message}`);
  }
}
