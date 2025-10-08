// Core data types
export type RawRow = Record<string, unknown>;
export type ParsedCsvRow = Record<string, string>;

export type RecordSource = 'bills' | 'buildium' | 'json';

export type CsvRecord = {
  src: RecordSource;
  i: number;
  property: string;
  amountCents: number | null;
  vendorNorm: string;
  vendorRaw: string;
  typeRaw: string;
  raw: RawRow;
};

export type JsonRecord = {
  src: 'json';
  i: number;
  property: string;
  amountCents: number | null;
  vendorNorm: string;
  vendorRaw: string;
  typeRaw: string;
  raw: RawRow;
};

export type ColumnMap = {
  property: string;
  amount: string;
  vendor: string;
  date?: string;
  memo?: string;
  type?: string;
};

export type UiGroup = {
  key: string;
  csvRows: CsvRecord[];
  jsonRows: JsonRecord[];
};

export type AnyRecord = CsvRecord | JsonRecord;

export type ComparisonMode = 'json-csv' | 'csv-csv';

// Re-export from other type files
export * from './columnMapping';
export * from './errors';
