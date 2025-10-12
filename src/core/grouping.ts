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
    const vendorRaw = group.csvRows[0]?.vendorRaw || (group.jsonRows[0] as any)?.vendorRaw || '';
    const vendorNorm = group.csvRows[0]?.vendorNorm || (group.jsonRows[0] as any)?.vendorNorm || '';

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
export function buildGroupsCsvToCsv(billsRecords: CsvRecord[], buildiumRecords: CsvRecord[]): UiGroup[] {
  const buildiumMap = new Map<string, CsvRecord[]>();
  for (const record of buildiumRecords) {
    if (record.amountCents == null || !record.property) continue;
    // Use absolute value for matching
    const k = keyify({ property: record.property, amountCents: Math.abs(record.amountCents), vendorNorm: record.vendorNorm });
    if (!buildiumMap.has(k)) buildiumMap.set(k, []);
    buildiumMap.get(k)!.push(record);
  }

  const groupsMap = new Map<string, UiGroup>();
  for (const billRecord of billsRecords) {
    if (billRecord.amountCents == null || !billRecord.property) continue;
    // Use absolute value for matching
    const k = keyify({ property: billRecord.property, amountCents: Math.abs(billRecord.amountCents), vendorNorm: billRecord.vendorNorm });
    const buildiumBucket = buildiumMap.get(k);
    if (!buildiumBucket) continue;
    
    if (!groupsMap.has(k)) {
      groupsMap.set(k, { key: k, csvRows: [billRecord], jsonRows: [] });
    } else {
      groupsMap.get(k)!.csvRows.push(billRecord);
    }
    
    // Add buildium records as "jsonRows" for display compatibility
    for (const buildiumRecord of buildiumBucket) {
      groupsMap.get(k)!.jsonRows.push(buildiumRecord as unknown as JsonRecord);
    }
  }

  return [...groupsMap.values()];
}
