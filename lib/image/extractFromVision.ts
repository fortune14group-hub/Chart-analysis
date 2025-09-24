import OpenAI from "openai";
import { Buffer } from "node:buffer";
import { Series } from "@/lib/types";

export type CandleVision = { t: string; o?: number; h?: number; l?: number; c: number; v?: number };

const MODEL = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";

const schema = {
  name: "chart_series_schema",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      series: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            t: { type: "string" },
            o: { type: "number" },
            h: { type: "number" },
            l: { type: "number" },
            c: { type: "number" },
            v: { type: "number" }
          },
          required: ["t", "c"]
        }
      },
      meta: {
        type: "object",
        additionalProperties: false,
        properties: {
          kind: { type: "string", enum: ["line", "ohlc"] },
          interval: { type: "string", enum: ["1m", "5m", "1h", "1d", "1w"] },
          yNote: { type: "string" }
        },
        required: ["kind", "interval"]
      }
    },
    required: ["series", "meta"]
  },
  strict: true
} as const;

const SYSTEM_PROMPT = `
Du är en strikt extraherare av tidsserie-data från ett finansiellt prisdiagram.
Instruktioner:
1) Identifiera om grafen är linje (Close) eller OHLC (candles).
2) Läs axlar: X = tid (ISO om möjligt), Y = pris (valuta spelar ingen roll).
3) Extrahera tabell med t (ISO), o,h,l,c (om candles; annars c) och v om volym tydligt finns.
4) Om exakta datum/tider inte kan avläsas: skapa jämna intervall (1m/5m/1h/1d/1w) med konsekventa tidsstämplar.
5) Använd punkt som decimal. Returnera ENDAST data som matchar JSON-schemat.
`;

export async function extractFromVision(imageBuffer: Buffer): Promise<{
  series: Series;
  meta: { kind: "line" | "ohlc"; interval: "1m" | "5m" | "1h" | "1d" | "1w"; yNote?: string };
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY saknas");

  const client = new OpenAI({ apiKey });

  const b64 = imageBuffer.toString("base64");
  const dataUrl = `data:image/png;base64,${b64}`;

  const res = await client.responses.create({
    model: MODEL,
    input: [
      { role: "system", content: [{ type: "text", text: SYSTEM_PROMPT }] },
      {
        role: "user",
        content: [
          { type: "input_text", text: "Extrahera tidsserie enligt schema." },
          { type: "input_image", image_url: dataUrl }
        ]
      }
    ],
    response_format: { type: "json_schema", json_schema: schema }
  });

  const text = (res as any).output_text || (res as any).choices?.[0]?.message?.content?.[0]?.text;
  if (!text) throw new Error("Tomt svar från Vision");

  const parsed = JSON.parse(text);
  const series: Series = (parsed.series as Series).map((d: any) => {
    if (parsed.meta?.kind === "line") {
      const c = Number(d.c);
      return { t: String(d.t), o: c, h: c, l: c, c, v: d.v != null ? Number(d.v) : undefined };
    }
    return {
      t: String(d.t),
      o: d.o != null ? Number(d.o) : Number(d.c),
      h: d.h != null ? Number(d.h) : Number(d.c),
      l: d.l != null ? Number(d.l) : Number(d.c),
      c: Number(d.c),
      v: d.v != null ? Number(d.v) : undefined
    };
  });

  return { series, meta: parsed.meta };
}
