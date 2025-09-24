const memory = new Map<string, number>();

export function seenEvent(
  id: string,
  ttlMs = Number(process.env.WEBHOOK_IDEMP_TTL_MS || 2 * 60 * 60 * 1000)
) {
  const now = Date.now();
  if (Math.random() < 0.01) {
    for (const [key, ts] of memory) {
      if (now - ts > ttlMs) memory.delete(key);
    }
  }
  if (memory.has(id)) return true;
  memory.set(id, now);
  return false;
}
