import { useState, useCallback } from 'react';
import { buildGroupsCsvToCsv, groupByVendor } from '../core';
import type { CsvRecord, VendorGroup } from '../types';

export function useDuplicateDetection() {
  const [vendorGroups, setVendorGroups] = useState<VendorGroup[]>([]);
  const [vendorsWithoutDuplicates, setVendorsWithoutDuplicates] = useState<string[]>([]);
  const [invalidBills, setInvalidBills] = useState<CsvRecord[]>([]);

  const findDuplicates = useCallback((billsRecords: CsvRecord[], buildiumRecords: CsvRecord[]) => {
    // Find duplicates between the two CSVs
    const { validGroups: duplicateGroups, invalidBills: foundInvalidBills } = buildGroupsCsvToCsv(
      billsRecords,
      buildiumRecords,
    );

    // Store invalid bills and log them
    setInvalidBills(foundInvalidBills);
    if (foundInvalidBills.length > 0) {
      console.log('Invalid bills requiring attention:', foundInvalidBills);
    }

    // Organize results by vendor - returns vendors with and without duplicates
    const { vendorsWithDuplicates, vendorsWithoutDuplicates } = groupByVendor(
      duplicateGroups,
      billsRecords,
      buildiumRecords,
    );

    setVendorGroups(vendorsWithDuplicates);
    setVendorsWithoutDuplicates(vendorsWithoutDuplicates);
  }, []);

  const reset = useCallback(() => {
    setVendorGroups([]);
    setVendorsWithoutDuplicates([]);
    setInvalidBills([]);
  }, []);

  return {
    vendorGroups,
    vendorsWithoutDuplicates,
    invalidBills,
    findDuplicates,
    reset,
  };
}
