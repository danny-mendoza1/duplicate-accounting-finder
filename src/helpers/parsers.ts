import { parse } from "csv-parse/browser/esm/sync";
import { normalizeAmount, normalizeProperty, normalizeVendor } from "./normalizers";
import type { ColumnMap, CsvRecord, JsonRecord, ParsedCsvRow } from "../types";


function validateColumns(row: Record<string, unknown>, columns: ColumnMap, source: string): void {
  const required: Array<keyof Pick<ColumnMap, 'property' | 'amount' | 'vendor'>> = ['property', 'amount', 'vendor'];
  const missing = required.filter(key => {
    const columnName = columns[key];
    return columnName === undefined || !(columnName in row);
  });
  
  if (missing.length > 0) {
    const missingColumnNames = missing
      .map(k => columns[k])
      .filter((name): name is string => name !== undefined);
    throw new Error(
      `${source} missing required columns: ${missingColumnNames.join(', ')}`
    );
  }
}

export function parseCsvText(csv: string, csvColumns: ColumnMap): CsvRecord[] {
  try {
    const rows = parse(csv, {
      bom: true,
      columns: (header: string[]) => header.map(h => h.trim()),
      skip_empty_lines: true,
      trim: true
    }) as ParsedCsvRow[];

    // Validate columns before processing
    if (rows.length > 0) {
      validateColumns(rows[0], csvColumns, 'CSV');
    }

    return rows.map((row, index) => ({
      src: 'csv',
      i: index,
      property: normalizeProperty(row[csvColumns.property]),
      amountCents: normalizeAmount(row[csvColumns.amount]),
      vendorNorm: normalizeVendor(row[csvColumns.vendor]),
      vendorRaw: row[csvColumns.vendor] ?? 'UnknownVendor',
      raw: row
    }));
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function parseJsonText(text: string, jsonColumns: ColumnMap): JsonRecord[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) {
    throw new Error(
      `Invalid JSON format. Expected an array of objects, but received: ${typeof data}`
    );
  }

  // Validate columns before processing
  if (data.length > 0) {
    validateColumns(data[0], jsonColumns, 'JSON');
  }

  return data.map((row, index) => ({
    src: 'json',
    i: index,
    property: normalizeProperty(row[jsonColumns.property]),
    amountCents: normalizeAmount(row[jsonColumns.amount]),
    vendorNorm: normalizeVendor(row[jsonColumns.vendor]),
    vendorRaw: row[jsonColumns.vendor] ?? 'UnknownVendor',
    raw: row
  }));

}
