import type { CsvRecord } from '../types';

export function normalizeAmount(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null;
  let s = String(value).trim();

  // Handle accounting negatives
  // (1) parentheses: (123.45) => -123.45
  let sign = 1;
  if (/^\(.*\)$/.test(s)) {
    sign = -1;
    s = s.slice(1, -1);
  }
  // (2) trailing minus: 123.45- => -123.45
  if (/-$/.test(s)) {
    sign = -1;
    s = s.slice(0, -1);
  }

  const n = Number(s.replace(/[$,]/g, ''));
  if (Number.isNaN(n)) return null;
  return Math.round(sign * n * 100);
}

export function normalizeProperty(value: string): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function normalizeVendor(value: string) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function keyify({
  property,
  amountCents,
}: Pick<CsvRecord, 'property' | 'amountCents'>): string {
  return `${property}|${amountCents}`;
}
