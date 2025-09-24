import { NextRequest, NextResponse } from "next/server";
import { mockAuthDB } from "@/lib/db/mockAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const authHdr = req.headers.get("authorization") || "";
  const bearer = authHdr.replace(/^Bearer\s+/i, "");
  const url = new URL(req.url);
  const qToken = url.searchParams.get("token");
  const token = bearer || qToken;
  if (!token || token !== process.env.DEV_ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let email = "";
  let enable: boolean | null = null;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    email = String(body.email || "");
    if (typeof body.enable === "boolean") enable = body.enable;
  } else {
    const bodyText = await req.text();
    try {
      const body = Object.fromEntries(new URLSearchParams(bodyText));
      email = String(body.email || "");
      if (body.enable === "true" || body.enable === "false") enable = body.enable === "true";
    } catch {}
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const current = !!mockAuthDB.proUsers.get(email);
  const nextValue = enable === null ? !current : enable;
  mockAuthDB.proUsers.set(email, nextValue);

  return NextResponse.json({ ok: true, email, pro: nextValue });
}
