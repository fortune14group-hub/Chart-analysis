import Link from "next/link";
import { notFound } from "next/navigation";
import ChartCard from "@/components/ChartCard";
import SummaryPanel from "@/components/SummaryPanel";
import SignalsTable from "@/components/SignalsTable";
import { getAnalysis } from "@/lib/utils/persist";
import { signalsToCsv } from "@/lib/utils/csv";
import type { AnalysisResult } from "@/lib/types";
import { Suspense } from "react";

export default function ResultPage({ params }: { params: { id: string } }) {
  const analysis = getAnalysis(params.id);
  if (!analysis) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Analysresultat</h1>
          <p className="mt-1 text-sm opacity-70">
            {analysis.meta.market.toUpperCase()} · {analysis.meta.resolution} · {analysis.meta.createdAt}
          </p>
        </div>
        <Link href="/" className="rounded-xl border px-4 py-2 text-sm hover:bg-accent">
          Ny analys
        </Link>
      </header>

      <Suspense fallback={<div className="rounded-2xl border bg-card/40 p-6">Laddar analys …</div>}>
        <ResultClient analysis={analysis} />
      </Suspense>
    </main>
  );
}

function ResultClient({ analysis }: { analysis: AnalysisResult }) {
  "use client";

  const chartId = `chart-${analysis.meta.id}`;

  async function exportPng() {
    const node = document.getElementById(chartId);
    if (!node) return;
    const { downloadElementAsPng } = await import("@/lib/utils/export");
    await downloadElementAsPng(node, `chart2signals-${analysis.meta.id}.png`, "#0b1220");
  }

  function exportCsv() {
    const csv = signalsToCsv(analysis.signals);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `chart2signals-${analysis.meta.id}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function exportJson() {
    const json = JSON.stringify({ meta: analysis.meta, signals: analysis.signals }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `chart2signals-${analysis.meta.id}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard id={chartId} series={analysis.series} indicators={analysis.indicators} signals={analysis.signals} />
        </div>
        <SummaryPanel
          summary={analysis.summary.text}
          latestSignal={analysis.summary.latestSignal ?? undefined}
          onExportPng={exportPng}
          onExportCsv={exportCsv}
          onExportJson={exportJson}
        />
      </div>
      <SignalsTable signals={analysis.signals} />
    </div>
  );
}
