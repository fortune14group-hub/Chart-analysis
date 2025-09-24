export function ema(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null);
  if (period <= 0 || !values.length) return result;
  const multiplier = 2 / (period + 1);
  let prev: number | null = null;
  let sum = 0;
  for (let i = 0; i < values.length; i += 1) {
    const price = values[i];
    if (i < period) {
      sum += price;
      if (i === period - 1) {
        prev = sum / period;
        result[i] = prev;
      }
      continue;
    }
    prev = prev === null ? price : price * multiplier + prev * (1 - multiplier);
    result[i] = prev;
  }
  return result;
}
