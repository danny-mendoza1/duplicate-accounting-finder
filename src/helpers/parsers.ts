import type { RawRow } from "../types";

export function parseJsonText(text: string): RawRow[] {
  const data = JSON.parse(text);
  if (Array.isArray(data)) return data as RawRow[];
  if (data && typeof data === 'object' && 'rows' in data && Array.isArray((data as any).rows)) {
    return (data as any).rows as RawRow[];
  }
  throw new Error('JSON must be an array of objects (or { rows: [...] }).');
}

export function parseCsvText(text: string): RawRow[] {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  if (!headerLine) return [];
  const headers = headerLine.split(',').map(h => h.trim());
  return lines
    .filter(l => l.trim().length > 0)
    .map((line) => {
      const cells = line.split(','); // naive; replace with robust parser if needed
      const row: RawRow = {};
      headers.forEach((h, i) => { row[h] = (cells[i] ?? '').trim(); });
      return row;
    });
}