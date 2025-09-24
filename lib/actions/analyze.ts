"use server";

import { Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { extractFromVision } from "@/lib/image/extractFromVision";
import { extractWithOpenCV } from "@/lib/image/extractWithOpenCV";
import { parseCsv } from "@/lib/utils/csv";
import { sanitizeSeries } from "@/lib/utils/normalize";
import { resampleSeries } from "@/lib/utils/resample";
import { computeIndicators } from "@/lib/ta";
import { generateSignals } from "@/lib/signals/rules";
import { applyRiskManagement } from "@/lib/signals/risk";
import { persistAnalysis } from "@/lib/utils/persist";
import type { AnalysisResult, IndicatorOptions, Series } from "@/lib/types";
import { redirect } from "next/navigation";

const indicatorKeys = ["sma20", "sma50", "ema9", "ema21", "rsi14", "macd", "boll20"] as const;

export type AnalysisActionState = { error?: string };

export async function analyzeImage(_: AnalysisActionState, formData: FormData): Promise<AnalysisActionState> {
  const market = (formData.get("market") as string) || "stock";
  const resolution = (formData.get("resolution") as string) || "1h";

  const options: IndicatorOptions = indicatorKeys.reduce((acc, key) => {
    acc[key] = formData.get(key) === "on";
    return acc;
  }, {} as any);

  let series: Series = [];
  let metaInterval = resolution as "1m" | "5m" | "1h" | "1d" | "1w";
  let lastError: Error | null = null;

  try {
    const csvText = formData.get("csvText");
    const csvFile = formData.get("csvFile");
    if (csvFile instanceof File && csvFile.size > 0) {
      const text = await csvFile.text();
      series = parseCsv(text);
    } else if (typeof csvText === "string" && csvText.trim().length > 0) {
      series = parseCsv(csvText);
    }

    const file = formData.get("chartFile");
    if (series.length === 0 && file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const tmpPath = join(tmpdir(), `${Date.now()}-${file.name}`);
      await fs.writeFile(tmpPath, buffer);
      if (process.env.OPENAI_API_KEY) {
        try {
          const vision = await extractFromVision(buffer);
          series = vision.series;
          metaInterval = vision.meta.interval;
        } catch (error) {
          lastError = error as Error;
        }
      }
      if (!series.length) {
        try {
          const heuristics = await extractWithOpenCV(buffer, metaInterval);
          series = heuristics.series;
          metaInterval = heuristics.meta.interval;
        } catch (error) {
          lastError = error as Error;
        }
      }
    }
  } catch (error) {
    lastError = error as Error;
  }

  if (!series.length) {
    return {
      error:
        lastError?.message ||
        "Kunde inte tolka data. Ladda upp en tydligare bild eller använd CSV enligt formatet t,o,h,l,c[,v]."
    };
  }

  const cleaned = sanitizeSeries(series);
  if (!cleaned.length) {
    return { error: "Inget giltigt prisdata hittades." };
  }

  const resampled = resampleSeries(cleaned, metaInterval);
  const indicators = computeIndicators(resampled, options);
  const baseSignals = generateSignals({ series: resampled, indicators, options });
  const signals = applyRiskManagement(baseSignals, indicators.atr14);
  const latestSignal = signals.at(-1) ?? null;
  const summary = buildSummary(market, metaInterval, signals, latestSignal);

  const id = persistAnalysis({
    meta: {
      market: market as AnalysisResult["meta"]["market"],
      resolution: metaInterval,
      indicators: options,
      createdAt: new Date().toISOString()
    },
    series: resampled,
    indicators,
    overlay: indicators.boll20 ? { bollinger: indicators.boll20 } : undefined,
    signals,
    summary: {
      text: summary,
      latestSignal
    }
  });

  redirect(`/result/${id}`);
}

function buildSummary(
  market: string,
  resolution: string,
  signals: AnalysisResult["signals"],
  latestSignal: AnalysisResult["signals"][number] | null
) {
  const marketLabel = market === "crypto" ? "kryptomarknaden" : market === "forex" ? "valutaparet" : "aktiemarknaden";
  const base = `${signals.length} signaler identifierades för ${marketLabel} (${resolution}).`;
  if (!latestSignal) return base + " Inga aktiva signaler hittades.";
  return `${base} Senaste signal: ${latestSignal.type} vid ${latestSignal.price.toFixed(2)} med konfidens ${(latestSignal.confidence * 100).toFixed(0)}%.`;
}
