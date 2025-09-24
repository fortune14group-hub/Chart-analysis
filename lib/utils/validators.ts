export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function isNonEmpty(v: string, min = 1) {
  return typeof v === "string" && v.trim().length >= min;
}
