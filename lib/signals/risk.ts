import { Signal } from "@/lib/types";

export function applyRiskManagement(signals: Signal[], atrValues: (number | null)[]): Signal[] {
  return signals.map((signal) => {
    const atr = atrValues[signal.index];
    if (!atr || Number.isNaN(atr)) return signal;
    const atrValue = atr;
    if (signal.type === "BUY") {
      return {
        ...signal,
        stopLoss: Number((signal.price - 1.5 * atrValue).toFixed(2)),
        takeProfit: Number((signal.price + 2 * atrValue).toFixed(2))
      };
    }
    return {
      ...signal,
      stopLoss: Number((signal.price + 1.5 * atrValue).toFixed(2)),
      takeProfit: Number((signal.price - 2 * atrValue).toFixed(2))
    };
  });
}
