export type Candle = { t: string; o?: number; h?: number; l?: number; c: number; v?: number };
export type Series = Candle[];

export type IndicatorOptions = {
  sma20?: boolean;
  sma50?: boolean;
  ema9?: boolean;
  ema21?: boolean;
  rsi14?: boolean;
  macd?: boolean;
  boll20?: boolean;
};

export type SignalType = "BUY" | "SELL";

export type Signal = {
  type: SignalType;
  reason: string[];
  timestamp: string;
  index: number;
  price: number;
  confidence: number;
  stopLoss?: number;
  takeProfit?: number;
};

export type AnalysisMeta = {
  id: string;
  market: "stock" | "crypto" | "forex";
  resolution: "1m" | "5m" | "1h" | "1d" | "1w";
  indicators: IndicatorOptions;
  createdAt: string;
};

export type AnalysisResult = {
  meta: AnalysisMeta;
  series: Series;
  indicators: Record<string, any>;
  overlay?: Record<string, any>;
  signals: Signal[];
  summary: {
    text: string;
    latestSignal?: Signal | null;
  };
};
