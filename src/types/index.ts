// Core data types
export type RawRow = Record<string, unknown>;
export type ParsedCsvRow = Record<string, string>;

export type CsvRecord = {
  src: 'csv';
  i: number;
  property: string;
  amountCents: number | null;
  vendorNorm: string;
  vendorRaw: string;
  raw: RawRow;
};

export type JsonRecord = {
  src: 'json';
  i: number;
  property: string;
  amountCents: number | null;
  vendorNorm: string;
  vendorRaw: string;
  raw: RawRow;
};

export type ColumnMap = {
  property: string;
  amount: string;
  vendor: string;
  date?: string;
  memo?: string;
};

export type UiGroup = {
  key: string;
  csvRows: CsvRecord[];
  jsonRows: JsonRecord[];
};

export type AnyRecord = CsvRecord | JsonRecord;

// Re-export from other type files
export * from './columnMapping';
export * from './errors';
