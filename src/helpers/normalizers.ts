import type { CsvRecord, RawRow } from "../types";

export function normalizeAmount(value: string): number | null {
  if (value === undefined || value === null || value === '') return null;

  const n = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, ''));
  if (Number.isNaN(n)) return null;
  return Math.round(n * 100); // integer cents
}

export function normalizeProperty(value: string): string {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

export function normalizeVendor(value: string) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

export function keyify({ property, amountCents }: Pick<CsvRecord, 'property' | 'amountCents'>): string {
  return `${property}|${amountCents}`;
}