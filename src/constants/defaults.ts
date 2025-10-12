import type { ColumnMap } from '../types';

// File size limits
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_DISPLAY = '10MB';

// Column mappings for CSV files
export const BILLS_CSV_COLUMNS: ColumnMap = {
  property: 'Itemized Allocation Property Name',
  amount: 'Total Bill Amount',
  vendor: 'Vendor',
  date: 'Date',
  memo: 'Memo',
};

export const BUILDIUM_CSV_COLUMNS: ColumnMap = {
  property: 'buildingName',
  amount: 'amount',
  vendor: 'payeeNameRaw',
  date: 'entryDate',
  memo: 'postingMemo',
  type: 'journalCodeDescription',
};

// Error type constants
export const ERROR_TYPES = {
  PARSING_ERROR: 'PARSING_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMPTY_INPUT: 'EMPTY_INPUT',
  VENDOR_SCOPE_ERROR: 'VENDOR_SCOPE_ERROR',
  NO_MATCHES: 'NO_MATCHES',
} as const;
