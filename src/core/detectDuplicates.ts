export function detectDuplicates<T>(
  rows: readonly T[],
  makeKey: (r: T) => string
): Array<{ key: string; items: T[] }> {
  const byKey = new Map<string, T[]>();
  for (const r of rows) {
    const k = makeKey(r);
    (byKey.get(k) ?? byKey.set(k, []).get(k)!)!.push(r);
  }
  const out: Array<{ key: string; items: T[] }> = [];
  for (const [key, items] of byKey) if (items.length >= 2) out.push({ key, items });
  return out;
}
