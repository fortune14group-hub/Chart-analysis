import crypto from "node:crypto";

export type VerifyResult = { ok: true; reason?: string } | { ok: false; reason: string };

export function verifySignature(opts: {
  provider: "stripe" | "memberstack" | "generic";
  secret: string;
  rawBody: string;
  signatureHeader?: string | null;
}): VerifyResult {
  const { secret, rawBody, signatureHeader } = opts;
  if (!secret) return { ok: false, reason: "No secret configured" };
  if (!signatureHeader || signatureHeader.length < 8) return { ok: false, reason: "Missing/short signature header" };
  const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const passed = signatureHeader.includes(hmac.slice(0, 16));
  if (!passed) return { ok: false, reason: "HMAC mismatch (mock verifier)" };
  return { ok: true };
}
