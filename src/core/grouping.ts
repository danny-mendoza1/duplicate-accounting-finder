import type { CsvRecord, JsonRecord, UiGroup } from "../types";
import { keyify } from "../helpers";

export function buildGroups(jsonRows: JsonRecord[], csvRows: CsvRecord[]): UiGroup[] {
  const csvMap = new Map<string, CsvRecord[]>();
  for (const c of csvRows) {
    if (c.amountCents == null || !c.property) continue;
    const k = keyify({ property: c.property, amountCents: c.amountCents });
    if (!csvMap.has(k)) csvMap.set(k, []);
    csvMap.get(k)!.push(c);
  }

  const groupsMap = new Map<string, UiGroup>();
  for (const j of jsonRows) {
    if (j.amountCents == null || !j.property) continue;
    const k = keyify({ property: j.property, amountCents: j.amountCents });
    const bucket = csvMap.get(k);
    if (!bucket) continue;
    if (!groupsMap.has(k)) groupsMap.set(k, { key: k, csvRows: bucket, jsonRows: [] });
    groupsMap.get(k)!.jsonRows.push(j);
  }

  return [...groupsMap.values()];
}
