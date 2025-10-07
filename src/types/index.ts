export type RawRow = Record<string, unknown>;

export type CsvRecord = {
  src: 'csv';
  i: number;
  property: string;
  amountCents: number | null;
  vendorNorm: string;
  vendorRaw: string;
  raw: RawRow
};

export type ColumnMap = { property: string; amount: string; vendor: string };
export type JsonRecord = Omit<CsvRecord,"src"> & { src: "json" }