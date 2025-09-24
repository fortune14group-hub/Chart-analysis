"use client";

import { Signal } from "@/lib/types";
import { sv } from "@/lib/i18n/sv";
import { features } from "@/lib/utils/features";

export type SummaryPanelProps = {
  summary: string;
  latestSignal?: Signal | null;
  onExportPng: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
};

export default function SummaryPanel({ summary, latestSignal, onExportPng, onExportCsv, onExportJson }: SummaryPanelProps) {
  return (
    <section className="space-y-4 rounded-2xl border bg-card/70 p-4 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">{sv.result.summary}</h2>
        <p className="mt-1 text-sm opacity-90">{summary}</p>
      </div>

      {latestSignal && (
        <div className="rounded-xl border bg-background/40 p-4">
          <h3 className="text-sm font-medium">{sv.result.latestSignal}</h3>
          <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
            <p>
              <span className="opacity-70">Typ:</span> {latestSignal.type}
            </p>
            <p>
              <span className="opacity-70">Pris:</span> {latestSignal.price.toFixed(2)}
            </p>
            <p>
              <span className="opacity-70">{sv.result.entry}:</span> {latestSignal.price.toFixed(2)}
            </p>
            {latestSignal.stopLoss != null && (
              <p>
                <span className="opacity-70">{sv.result.stop}:</span> {latestSignal.stopLoss?.toFixed(2)}
              </p>
            )}
            {latestSignal.takeProfit != null && (
              <p>
                <span className="opacity-70">{sv.result.takeProfit}:</span> {latestSignal.takeProfit?.toFixed(2)}
              </p>
            )}
            <p>
              <span className="opacity-70">Konfidens:</span> {(latestSignal.confidence * 100).toFixed(0)}%
            </p>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm opacity-80">
            {latestSignal.reason.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={onExportPng} className="rounded-xl border px-3 py-2 hover:bg-accent">
          {sv.result.exportPng}
        </button>
        <button type="button" onClick={onExportCsv} className="rounded-xl border px-3 py-2 hover:bg-accent">
          {sv.result.exportCsv}
        </button>
        <button type="button" onClick={onExportJson} className="rounded-xl border px-3 py-2 hover:bg-accent">
          {sv.result.exportJson}
        </button>
        {features.proEnabled ? (
          <button type="button" className="rounded-xl border px-3 py-2 hover:bg-accent">
            Exportera PDF
          </button>
        ) : (
          <span className="inline-flex items-center rounded-xl border px-3 py-2 text-xs opacity-50">PDF (Pro)</span>
        )}
      </div>
    </section>
  );
}
