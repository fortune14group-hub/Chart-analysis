import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/lib/webhooks/verify";
import { routeEvent } from "@/lib/webhooks/handle";
import { seenEvent } from "@/lib/utils/idempotency";
import { pushStatus } from "@/lib/utils/status";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const provider = (process.env.WEBHOOK_PROVIDER || "generic") as "stripe" | "memberstack" | "generic";
  const secret = process.env.WEBHOOK_SECRET || "";

  const rawBody = await req.text();
  const sig =
    req.headers.get("stripe-signature") ||
    req.headers.get("x-memberstack-signature") ||
    req.headers.get("x-signature") ||
    null;

  const ver = verifySignature({ provider, secret, rawBody, signatureHeader: sig });
  if (!ver.ok) {
    console.error("[webhook] signature verify failed:", ver.reason);
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 400 });
  }

  let payload: any = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    payload = { raw: rawBody };
  }

  const evt = {
    id: payload?.id || payload?.event_id || payload?.data?.id || cryptoRandomId(),
    type: payload?.type || payload?.event || "unknown",
    created: payload?.created,
    data: payload?.data,
    raw: payload
  };

  if (seenEvent(evt.id)) return NextResponse.json({ ok: true, duplicate: true });

  try {
    const res = await routeEvent(evt);
    pushStatus({ id: evt.id, type: evt.type, created: evt.created, handled: res.handled, note: res.note, receivedAt: Date.now() });
    return NextResponse.json({ ok: true, handled: res.handled, note: res.note });
  } catch (err: any) {
    console.error("[webhook] handle error:", err?.message || err);
    return NextResponse.json({ ok: false, error: "handle_failed" }, { status: 500 });
  }
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
