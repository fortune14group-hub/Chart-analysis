import { ShieldCheck, LineChart, Gauge, CheckCircle2 } from "lucide-react";

export default function TrustBar() {
  const items = [
    { icon: ShieldCheck, text: "Lokalt först — inga hemligheter i klienten" },
    { icon: LineChart, text: "Indikatorer: SMA/EMA/RSI/MACD/Bollinger/ATR" },
    { icon: Gauge, text: "Snabb analys av uppladdade bilder" },
    { icon: CheckCircle2, text: "CSV-fallback för maximal robusthet" }
  ];
  return (
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, text }, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border bg-card/40 px-4 py-3 shadow-sm">
          <Icon className="size-5 opacity-80" aria-hidden />
          <span className="text-sm">{text}</span>
        </div>
      ))}
    </div>
  );
}
