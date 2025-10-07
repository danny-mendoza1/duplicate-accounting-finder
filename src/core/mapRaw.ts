import { normalizeProperty, normalizeAmount, normalizeVendor } from "../helpers";
import type { RawRow, CsvRecord, ColumnMap } from "../types";

export function mapRawToCsvRecord(raw: RawRow, i: number, cols: ColumnMap): Omit<CsvRecord, "src"> {
  return {
    i,
    property: normalizeProperty(raw[cols.property] as string),
    amountCents: normalizeAmount(raw[cols.amount] as any),
    vendorNorm: normalizeVendor(raw[cols.vendor] as string),
    vendorRaw: String(raw[cols.vendor] ?? "UnknownVendor"),
    raw,
  };
}
