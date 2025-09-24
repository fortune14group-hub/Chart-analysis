import Link from "next/link";
import { Check } from "lucide-react";
import { features } from "@/lib/utils/features";

export const metadata = {
  title: "Priser & FAQ – Chart2Signals",
  description: "Priser, funktioner och vanliga frågor för Chart2Signals by BetSpread."
};

const featuresFree = [
  "Ladda upp bild (PNG/JPG)",
  "Heuristisk tolkning (OpenCV)",
  "SMA/EMA/RSI/MACD/Bollinger",
  "ATR-baserade SL/TP-förslag",
  "Export av signaler (CSV/JSON)"
];

const featuresPro = [
  "Allt i Gratis",
  "Vision-tolkning (OpenAI) för bättre dataprecision",
  "Candlestick-stöd (OHLC) när möjligt",
  "PDF-rapport (server-renderad)",
  "Finjustera regler (RSI/MACD/ATR-sliders)"
];

function PriceCard({
  title,
  price,
  period,
  ctaHref,
  ctaLabel,
  features,
  highlighted = false
}: {
  title: string;
  price: string;
  period: string;
  ctaHref: string;
  ctaLabel: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border p-6 shadow-sm ${highlighted ? "ring-1 ring-primary" : ""}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-bold">{price}</span>
        <span className="mb-1 opacity-70">{period}</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`mt-6 inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm ${highlighted ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border p-4 open:bg-card/40">
      <summary className="cursor-pointer select-none text-sm font-medium">{q}</summary>
      <p className="mt-2 text-sm opacity-90">{a}</p>
    </details>
  );
}

export default function PricingPage() {
  const proEnabled = features.proEnabled;
  const faqs = [
    {
      q: "Behöver jag en API-nyckel?",
      a: "Nej för grundfunktioner. Vision-tolkning kräver OPENAI_API_KEY på servern. Saknas nyckel används heuristik och CSV-fallback."
    },
    {
      q: "Hur exakt är signalerna?",
      a: "Signaler bygger på klassiska regler (SMA-kors, MACD, RSI-reversaler, Bollinger-återtag). De är hjälpmedel, inte finansrådgivning."
    },
    {
      q: "Vad händer om bildtolkningen misslyckas?",
      a: "Du erbjuds att ladda upp CSV enligt format t,o,h,l,c[,v]. Exempel finns i appen."
    },
    {
      q: "Sparas mina uppladdade grafer?",
      a: "Data sparas endast i minnet under sessionen för att visa resultat. Ingen extern lagring görs."
    },
    {
      q: "Kan jag exportera resultatet?",
      a: "Ja, PNG av grafen samt CSV/JSON av signalerna. PDF-rapport finns i Pro-läget (om aktiverat)."
    }
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Priser & FAQ</h1>
        <p className="mt-2 text-sm opacity-80">Välj det som passar dig. Du kan alltid börja gratis.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <PriceCard title="Gratis" price="0 kr" period="/ mån" ctaHref="/" ctaLabel="Testa gratis" features={featuresFree} />
        <PriceCard
          title="Pro"
          price={proEnabled ? "299 kr" : "—"}
          period="/ mån"
          ctaHref={proEnabled ? "/signup" : "/pricing"}
          ctaLabel={proEnabled ? "Börja Pro" : "Be om tillgång"}
          features={featuresPro}
          highlighted
        />
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold">Vanliga frågor</h2>
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>
    </main>
  );
}
