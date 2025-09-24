import { NextRequest, NextResponse } from "next/server";
import { getRecent } from "@/lib/utils/status";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const qToken = url.searchParams.get("token");
  const hToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const token = qToken || hToken;
  if (!token || token !== process.env.STATUS_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") || 10)));
  const items = getRecent(limit);
  return NextResponse.json({ ok: true, count: items.length, items });
}
