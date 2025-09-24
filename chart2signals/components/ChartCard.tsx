"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Scatter
} from "recharts";
import type { Signal, Series } from "@/lib/types";
import type { IndicatorResult } from "@/lib/ta";

export type ChartCardProps = {
  id: string;
  series: Series;
  indicators: IndicatorResult;
  signals: Signal[];
};

export default function ChartCard({ id, series, indicators, signals }: ChartCardProps) {
  const data = useMemo(() => {
    return series.map((candle, index) => ({
      index,
      time: new Date(candle.t).toLocaleString("sv-SE"),
      close: candle.c,
      open: candle.o,
      high: candle.h,
      low: candle.l,
      volume: candle.v,
      sma20: indicators.sma20?.[index] ?? null,
      sma50: indicators.sma50?.[index] ?? null,
      ema9: indicators.ema9?.[index] ?? null,
      ema21: indicators.ema21?.[index] ?? null,
      rsi14: indicators.rsi14?.[index] ?? null,
      macd: indicators.macd?.macd[index] ?? null,
      macdSignal: indicators.macd?.signal[index] ?? null,
      bollMid: indicators.boll20?.middle[index] ?? null,
      bollUpper: indicators.boll20?.upper[index] ?? null,
      bollLower: indicators.boll20?.lower[index] ?? null
    }));
  }, [series, indicators]);

  const buySignals = signals.filter((s) => s.type === "BUY").map((s) => ({ ...s, value: data[s.index]?.close ?? s.price }));
  const sellSignals = signals
    .filter((s) => s.type === "SELL")
    .map((s) => ({ ...s, value: data[s.index]?.close ?? s.price }));

  return (
    <section id={id} className="rounded-2xl border bg-card/60 p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Pris & indikatorer</h2>
      <div className="h-[420px] w-full">
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 16, right: 32, bottom: 16, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="time" minTickGap={48} tick={{ fontSize: 12 }} />
            <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
            <YAxis
              yAxisId="volume"
              orientation="left"
              tick={{ fontSize: 10 }}
              domain={[0, "auto"]}
              hide={!series.some((c) => c.v)}
            />
            <Tooltip
              formatter={(value: number, name) => [value, name]}
              contentStyle={{ background: "rgba(9,11,18,0.9)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <Area
              type="monotone"
              dataKey="bollUpper"
              name="Bollinger övre"
              yAxisId="price"
              stroke="rgba(94, 234, 212, 0.5)"
              fill="rgba(94, 234, 212, 0.12)"
              activeDot={false}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="bollLower"
              name="Bollinger nedre"
              yAxisId="price"
              stroke="rgba(248, 113, 113, 0.4)"
              fill="rgba(248, 113, 113, 0.08)"
              activeDot={false}
              connectNulls
            />
            <Line type="monotone" dataKey="close" name="Close" yAxisId="price" stroke="#60a5fa" strokeWidth={2} dot={false} />
            {indicators.sma20 && (
              <Line type="monotone" dataKey="sma20" name="SMA 20" yAxisId="price" stroke="#facc15" strokeWidth={1.5} dot={false} connectNulls />
            )}
            {indicators.sma50 && (
              <Line type="monotone" dataKey="sma50" name="SMA 50" yAxisId="price" stroke="#fb7185" strokeWidth={1.5} dot={false} connectNulls />
            )}
            {indicators.ema9 && (
              <Line type="monotone" dataKey="ema9" name="EMA 9" yAxisId="price" stroke="#34d399" strokeWidth={1.2} dot={false} connectNulls />
            )}
            {indicators.ema21 && (
              <Line type="monotone" dataKey="ema21" name="EMA 21" yAxisId="price" stroke="#818cf8" strokeWidth={1.2} dot={false} connectNulls />
            )}
            <Bar dataKey="volume" name="Volym" yAxisId="volume" fill="rgba(59,130,246,0.3)" radius={[6, 6, 0, 0]} />
            <Scatter
              data={buySignals}
              yAxisId="price"
              name="BUY"
              shape={(props) => <SignalMarker {...props} color="#34d399" direction="up" />}
            />
            <Scatter
              data={sellSignals}
              yAxisId="price"
              name="SELL"
              shape={(props) => <SignalMarker {...props} color="#f87171" direction="down" />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

type SignalMarkerProps = {
  cx?: number;
  cy?: number;
  color: string;
  direction: "up" | "down";
};

function SignalMarker({ cx, cy, color, direction }: SignalMarkerProps) {
  if (typeof cx !== "number" || typeof cy !== "number") return null;
  const path = direction === "up" ? "M -6 6 L 0 -6 L 6 6 Z" : "M -6 -6 L 0 6 L 6 -6 Z";
  return <path d={path} transform={`translate(${cx}, ${cy})`} fill={color} stroke={color} />;
}
