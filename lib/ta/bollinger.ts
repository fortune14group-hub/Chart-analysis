export function bollinger(values: number[], period = 20, multiplier = 2) {
  const middle: (number | null)[] = new Array(values.length).fill(null);
  const upper: (number | null)[] = new Array(values.length).fill(null);
  const lower: (number | null)[] = new Array(values.length).fill(null);

  if (period <= 0) return { middle, upper, lower };

  for (let i = 0; i < values.length; i += 1) {
    if (i < period - 1) continue;
    let sum = 0;
    for (let j = i - period + 1; j <= i; j += 1) sum += values[j];
    const mean = sum / period;
    let variance = 0;
    for (let j = i - period + 1; j <= i; j += 1) variance += Math.pow(values[j] - mean, 2);
    const std = Math.sqrt(variance / period);
    middle[i] = mean;
    upper[i] = mean + multiplier * std;
    lower[i] = mean - multiplier * std;
  }

  return { middle, upper, lower };
}
