"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function CTASticky() {
  const pathname = usePathname();
  const hiddenOn = ["/result"];
  if (hiddenOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-3">
      <div className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-2xl border bg-card/80 px-4 py-3 shadow-lg backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Ladda upp en graf – få köp/sälj-signaler på sekunder.</p>
          <p className="truncate text-xs opacity-70">
            Chart2Signals by BetSpread · Vision + heuristik · CSV-fallback
          </p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-accent">
          Starta nu <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
