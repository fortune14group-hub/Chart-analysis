"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import UploadDropzone from "@/components/UploadDropzone";
import IndicatorToggles from "@/components/IndicatorToggles";
import ErrorState from "@/components/ErrorState";
import { sv } from "@/lib/i18n/sv";
import type { AnalysisActionState } from "@/lib/actions/analyze";

const initialState: AnalysisActionState = {};

type UploadFormProps = {
  action: (state: AnalysisActionState, formData: FormData) => Promise<AnalysisActionState>;
};

export default function UploadForm({ action }: UploadFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <UploadDropzone name="chartFile" />
      <p className="text-center text-xs opacity-70">{sv.upload.orCsv}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <MarketSelect />
        <ResolutionSelect />
      </div>
      <IndicatorToggles />
      <CsvFallback />
      {state.error && <ErrorState title="Analysen misslyckades" description={state.error} />}
      <SubmitButton />
    </form>
  );
}

function MarketSelect() {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{sv.upload.market}</span>
      <select name="market" className="rounded-xl border bg-background px-3 py-2">
        <option value="stock">Aktier</option>
        <option value="crypto">Krypto</option>
        <option value="forex">Forex</option>
      </select>
    </label>
  );
}

function ResolutionSelect() {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{sv.upload.resolution}</span>
      <select name="resolution" defaultValue="1h" className="rounded-xl border bg-background px-3 py-2">
        <option value="1m">1 minut</option>
        <option value="5m">5 minuter</option>
        <option value="1h">1 timme</option>
        <option value="1d">1 dag</option>
        <option value="1w">1 vecka</option>
      </select>
    </label>
  );
}

function CsvFallback() {
  return (
    <div className="space-y-2 rounded-2xl border bg-card/40 p-4 text-sm">
      <p className="font-medium">CSV-fallback</p>
      <p className="text-xs opacity-70">Ladda upp eller klistra in data enligt formatet t,o,h,l,c[,v].</p>
      <input type="file" name="csvFile" accept=".csv,text/csv" className="w-full rounded-xl border bg-background px-3 py-2 text-xs" />
      <textarea
        name="csvText"
        rows={3}
        placeholder="t,o,h,l,c,v"
        className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
      />
      <p className="text-xs opacity-60">
        Exempel finns i <Link href="/examples/sample.csv" className="underline">/examples/sample.csv</Link>
      </p>
    </div>
  );
}

function SubmitButton() {
  const status = useFormStatus();
  const label = status.pending ? "Analyserar …" : sv.upload.analyze;
  const steps = [sv.loading.step1, sv.loading.step2, sv.loading.step3];
  return (
    <div className="space-y-3">
      {status.pending && (
        <ol className="space-y-1 rounded-xl border bg-card/40 p-3 text-left text-xs">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-flex size-2 rounded-full bg-primary/80 animate-pulse"
                style={{ animationDelay: `${index * 150}ms` }}
              />
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl border px-5 py-2 text-sm font-medium hover:bg-accent disabled:opacity-60"
        disabled={status.pending}
      >
        {label}
      </button>
    </div>
  );
}
