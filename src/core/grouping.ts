import type { CsvRecord, JsonRecord, UiGroup, AnyRecord } from '../types';
import { keyify } from '../helpers';

export function buildGroups(jsonRows: JsonRecord[], csvRows: CsvRecord[]): UiGroup[] {
  const csvMap = new Map<string, CsvRecord[]>();
  for (const c of csvRows) {
    if (c.amountCents == null || !c.property) continue;
    // Use absolute value for matching
    const k = keyify({ property: c.property, amountCents: Math.abs(c.amountCents) });
    if (!csvMap.has(k)) csvMap.set(k, []);
    csvMap.get(k)!.push(c);
  }

  const groupsMap = new Map<string, UiGroup>();
  for (const j of jsonRows) {
    if (j.amountCents == null || !j.property) continue;
    // Use absolute value for matching
    const k = keyify({ property: j.property, amountCents: Math.abs(j.amountCents) });
    const bucket = csvMap.get(k);
    if (!bucket) continue;
    if (!groupsMap.has(k)) groupsMap.set(k, { key: k, csvRows: bucket, jsonRows: [] });
    groupsMap.get(k)!.jsonRows.push(j);
  }

  return [...groupsMap.values()];
}

// New function for CSV+CSV comparison mode
export function buildGroupsCsvToCsv(billsRecords: CsvRecord[], buildiumRecords: CsvRecord[]): UiGroup[] {
  const buildiumMap = new Map<string, CsvRecord[]>();
  for (const record of buildiumRecords) {
    if (record.amountCents == null || !record.property) continue;
    // Use absolute value for matching
    const k = keyify({ property: record.property, amountCents: Math.abs(record.amountCents) });
    if (!buildiumMap.has(k)) buildiumMap.set(k, []);
    buildiumMap.get(k)!.push(record);
  }

  const groupsMap = new Map<string, UiGroup>();
  for (const billRecord of billsRecords) {
    if (billRecord.amountCents == null || !billRecord.property) continue;
    // Use absolute value for matching
    const k = keyify({ property: billRecord.property, amountCents: Math.abs(billRecord.amountCents) });
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
