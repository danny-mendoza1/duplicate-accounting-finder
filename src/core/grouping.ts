import type { CsvRecord, JsonRecord, UiGroup, VendorGroup } from '../types';
import { keyify } from '../helpers';

export function buildGroups(jsonRows: JsonRecord[], csvRows: CsvRecord[]): UiGroup[] {
  const csvMap = new Map<string, CsvRecord[]>();
  for (const c of csvRows) {
    if (c.amountCents == null || !c.property) continue;
    // Use absolute value for matching
    const k = keyify({ property: c.property, amountCents: Math.abs(c.amountCents), vendorNorm: c.vendorNorm });
    if (!csvMap.has(k)) csvMap.set(k, []);
    csvMap.get(k)!.push(c);
  }

  const groupsMap = new Map<string, UiGroup>();
  for (const j of jsonRows) {
    if (j.amountCents == null || !j.property) continue;
    // Use absolute value for matching
    const k = keyify({ property: j.property, amountCents: Math.abs(j.amountCents), vendorNorm: j.vendorNorm });
    const bucket = csvMap.get(k);
    if (!bucket) continue;
    if (!groupsMap.has(k)) groupsMap.set(k, { key: k, csvRows: bucket, jsonRows: [] });
    groupsMap.get(k)!.jsonRows.push(j);
  }

  return [...groupsMap.values()];
}

// New function to organize duplicate groups by vendor
export function groupByVendor(
  duplicateGroups: UiGroup[],
  allBillsRecords: CsvRecord[],
  allBuildiumRecords: CsvRecord[]
): VendorGroup[] {
  // Map vendor groups by vendorNorm
  const vendorMap = new Map<string, VendorGroup>();

  // Process duplicate groups
  for (const group of duplicateGroups) {
    // Get vendor from any record in the group (they should all match now due to key including vendor)
    const firstRecord = group.csvRows[0] || group.jsonRows[0];
    const vendorRaw = firstRecord?.vendorRaw || '';
    const vendorNorm = firstRecord?.vendorNorm || '';

    if (!vendorMap.has(vendorNorm)) {
      vendorMap.set(vendorNorm, {
        vendorRaw,
        vendorNorm,
        groups: [],
        billsCount: 0,
        buildiumCount: 0,
        duplicateGroupCount: 0,
      });
    }

    const vendorGroup = vendorMap.get(vendorNorm)!;
    vendorGroup.groups.push(group);
    vendorGroup.duplicateGroupCount++;
    vendorGroup.billsCount += group.csvRows.length;
    vendorGroup.buildiumCount += group.jsonRows.length;
  }

  // Identify all vendors that were processed but had no duplicates
  const allVendorsProcessed = new Set<string>();
  
  for (const record of allBillsRecords) {
    if (record.vendorNorm) {
      allVendorsProcessed.add(record.vendorNorm);
    }
  }
  
  for (const record of allBuildiumRecords) {
    if (record.vendorNorm) {
      allVendorsProcessed.add(record.vendorNorm);
    }
  }

  // Get vendors with duplicates
  const vendorsWithDuplicates = Array.from(vendorMap.values());

  // Get vendors without duplicates
  const vendorsWithoutDuplicates: string[] = [];
  for (const vendorNorm of allVendorsProcessed) {
    if (!vendorMap.has(vendorNorm)) {
      // Find the raw vendor name
      const billRecord = allBillsRecords.find(r => r.vendorNorm === vendorNorm);
      const buildiumRecord = allBuildiumRecords.find(r => r.vendorNorm === vendorNorm);
      const vendorRaw = billRecord?.vendorRaw || buildiumRecord?.vendorRaw || vendorNorm;
      vendorsWithoutDuplicates.push(vendorRaw);
    }
  }

  return vendorsWithDuplicates;
}

// New function for CSV+CSV comparison mode
export function buildGroupsCsvToCsv(
  billsRecords: CsvRecord[], 
  buildiumRecords: CsvRecord[]
): { validGroups: UiGroup[], invalidBills: CsvRecord[] } {
  // Separate valid and invalid bills - never drop any bills
  const validBills: CsvRecord[] = [];
  const invalidBills: CsvRecord[] = [];
  
  for (const bill of billsRecords) {
    if (bill.amountCents == null || !bill.property) {
      invalidBills.push(bill);
    } else {
      validBills.push(bill);
    }
  }
  
  // Build index of valid buildium records (can skip invalid buildium records)
  const buildiumIndex = new Map<string, CsvRecord[]>();
  for (const record of buildiumRecords) {
    if (record.amountCents == null || !record.property) continue;
    // Use absolute value for matching
    const k = keyify({ 
      property: record.property, 
      amountCents: Math.abs(record.amountCents), 
      vendorNorm: record.vendorNorm 
    });
    if (!buildiumIndex.has(k)) buildiumIndex.set(k, []);
    buildiumIndex.get(k)!.push(record);
  }

  // Find bills that match buildium records
  const groupsMap = new Map<string, UiGroup>();
  
  for (const bill of validBills) {
    const k = keyify({ 
      property: bill.property, 
      amountCents: Math.abs(bill.amountCents!), 
      vendorNorm: bill.vendorNorm 
    });
    
    const buildiumMatches = buildiumIndex.get(k);
    if (!buildiumMatches) continue; // No match, skip this bill
    
    // First time seeing this key - create group with buildium records
    if (!groupsMap.has(k)) {
      groupsMap.set(k, { 
        key: k, 
        csvRows: [bill], 
        jsonRows: buildiumMatches.map(b => b as unknown as JsonRecord)
      });
    } else {
      // Additional bill with same key - just add the bill (buildium records already added)
      groupsMap.get(k)!.csvRows.push(bill);
    }
  }

  return {
    validGroups: Array.from(groupsMap.values()),
    invalidBills
  };
}
