import type { ColumnMap } from './index';

export interface ColumnMappingPreset {
  id: string;
  name: string;
  description: string;
  csvColumns: ColumnMap;
  jsonColumns: ColumnMap;
}

export const DEFAULT_PRESET: ColumnMappingPreset = {
  id: 'default',
  name: 'Default (Buildium)',
  description: 'Standard column mapping',
  csvColumns: {
    property: 'Itemized Allocation Property Name',
    amount: 'Total Bill Amount',
    vendor: 'Vendor',
    date: 'Date',
    memo: 'Memo',
    type: undefined, // Bills to Enter CSV doesn't have a type field - always "Bill"
  },
  jsonColumns: {
    property: 'Property',
    amount: 'Amount',
    vendor: 'PayeeName',
    date: 'Date',
    memo: 'Memo',
    type: 'TypeDescription',
  },
};

// Column mapping for Buildium CSV export
export const BUILDIUM_CSV_COLUMNS: ColumnMap = {
  property: 'buildingName',
  amount: 'amount',
  vendor: 'payeeNameRaw',
  date: 'entryDate',
  memo: 'postingMemo',
  type: 'journalCodeDescription',
};

// Future presets can be added here
export const COLUMN_PRESETS: ColumnMappingPreset[] = [DEFAULT_PRESET];

export function getPresetById(id: string): ColumnMappingPreset | undefined {
  return COLUMN_PRESETS.find((preset) => preset.id === id);
}
