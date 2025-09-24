import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          padding: "60px",
          background: "linear-gradient(135deg, #0b1220 0%, #0e1b2e 30%, #0b1220 100%)",
          color: "white",
          fontSize: 48,
          fontWeight: 600,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 780 }}>
          <div>Chart2Signals</div>
          <div style={{ fontSize: 28, fontWeight: 400, opacity: 0.9 }}>
            Ladda upp en graf – få köp/sälj-signaler på sekunder
          </div>
          <div style={{ fontSize: 22, opacity: 0.8 }}>
            SMA · EMA · RSI · MACD · Bollinger · ATR (SL/TP)
          </div>
        </div>
        <div
          style={{
            width: 360,
            height: 220,
            borderRadius: 16,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24
          }}
        >
          📈 Signal: BUY ↑
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
