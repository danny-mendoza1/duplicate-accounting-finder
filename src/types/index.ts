// Core data types
export type CsvRawRow = Record<string, string | number | null | undefined>;
export type ParsedCsvRow = Record<string, string>;

export type RecordSource = 'bills' | 'buildium';

export type CsvRecord = {
  src: RecordSource;
  i: number;
  property: string;
  amountCents: number | null;
  vendorNorm: string;
  vendorRaw: string;
  typeRaw: string;
  raw: CsvRawRow;
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
  billsRows: CsvRecord[];
  buildiumRows: CsvRecord[];
};

export type VendorGroup = {
  vendorRaw: string;
  vendorNorm: string;
  groups: UiGroup[];
  billsCount: number;
  buildiumCount: number;
  duplicateGroupCount: number;
};

// Result types
export type ParseFilesResult = {
  billsRecords: CsvRecord[];
  buildiumRecords: CsvRecord[];
};

export type DuplicateDetectionResult = {
  validGroups: UiGroup[];
  invalidBills: CsvRecord[];
};

// Sorting types
export type SortColumn = 'type' | 'date';
export type SortDirection = 'asc' | 'desc';

export type SortConfig = {
  column: SortColumn;
  direction: SortDirection;
};

// Re-export from other type files
export * from './errors';
