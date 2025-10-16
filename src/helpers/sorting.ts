import type { CsvRecord, SortConfig } from '../types';
import { BUILDIUM_CSV_COLUMNS } from '../constants';
import { getRaw } from './uiRendering';

/**
 * Sorts records while keeping the first record (bills) static.
 * Only buildium records (index 1+) are sorted.
 *
 * @param records - Array of CsvRecords where first item is always the bills record
 * @param config - Sort configuration (column and direction)
 * @returns New array with bills record first, followed by sorted buildium records
 */
export function sortRecordsWithStaticFirst(
  records: CsvRecord[],
  config: SortConfig | undefined,
): CsvRecord[] {
  if (!config || records.length <= 1) {
    return records;
  }

  const billsRecord = records[0]; // Always stays first
  const buildiumRecords = records.slice(1);

  const sorted = [...buildiumRecords].sort((a, b) => {
    let comparison = 0;

    switch (config.column) {
      case 'type':
        comparison = a.typeRaw.localeCompare(b.typeRaw);
        break;
        
      case 'date': {
        const dateA = String(getRaw(a.raw, BUILDIUM_CSV_COLUMNS.date) ?? '');
        const dateB = String(getRaw(b.raw, BUILDIUM_CSV_COLUMNS.date) ?? '');
        const timeA = new Date(dateA).getTime();
        const timeB = new Date(dateB).getTime();
        
        // Handle invalid dates (NaN) by treating them as equal
        if (isNaN(timeA) && isNaN(timeB)) comparison = 0;
        else if (isNaN(timeA)) comparison = 1; // Invalid dates sort to end
        else if (isNaN(timeB)) comparison = -1;
        else comparison = timeA - timeB;
        break;
      }
    }

    return config.direction === 'asc' ? comparison : -comparison;
  });

  return [billsRecord, ...sorted];
}
