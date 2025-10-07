import { normalizeAmount } from "./normalizers";

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export function formatUSDFromCents(cents: number): string {
  return cents == null ? '' : USD.format(cents / 100);
}
export function formatUSD(value: string): string {
  const cents = normalizeAmount(value);
  return cents == null ? String(value ?? '') : USD.format(Number(cents) / 100);
}