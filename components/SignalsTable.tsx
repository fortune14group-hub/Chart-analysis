import { Signal } from "@/lib/types";

export type SignalsTableProps = {
  signals: Signal[];
};

export default function SignalsTable({ signals }: SignalsTableProps) {
  if (!signals.length) {
    return (
      <div className="rounded-2xl border bg-card/40 p-4 text-sm opacity-70">
        Inga signaler genererades för denna konfiguration. Prova fler indikatorer eller annan upplösning.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card/40">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="border-b px-4 py-2">Tid</th>
            <th className="border-b px-4 py-2">Typ</th>
            <th className="border-b px-4 py-2">Pris</th>
            <th className="border-b px-4 py-2">Konfidens</th>
            <th className="border-b px-4 py-2">Stop-loss</th>
            <th className="border-b px-4 py-2">Take-profit</th>
            <th className="border-b px-4 py-2">Orsak</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((signal) => (
            <tr key={`${signal.timestamp}-${signal.type}`} className="border-b border-border/40">
              <td className="px-4 py-2">{new Date(signal.timestamp).toLocaleString("sv-SE")}</td>
              <td className="px-4 py-2 font-medium">{signal.type}</td>
              <td className="px-4 py-2">{signal.price.toFixed(2)}</td>
              <td className="px-4 py-2">{(signal.confidence * 100).toFixed(0)}%</td>
              <td className="px-4 py-2">{signal.stopLoss != null ? signal.stopLoss.toFixed(2) : "-"}</td>
              <td className="px-4 py-2">{signal.takeProfit != null ? signal.takeProfit.toFixed(2) : "-"}</td>
              <td className="px-4 py-2">{signal.reason.join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
