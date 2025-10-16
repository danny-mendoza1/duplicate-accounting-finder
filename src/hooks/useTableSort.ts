import { useState, useCallback } from 'react';
import type { SortColumn, SortConfig } from '../types';

export function useTableSort() {
  const [sortConfigs, setSortConfigs] = useState<Map<string, SortConfig>>(new Map());

  const toggleSort = useCallback((groupKey: string, column: SortColumn) => {
    setSortConfigs((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(groupKey);

      if (!current || current.column !== column) {
        // First click: ascending
        newMap.set(groupKey, { column, direction: 'asc' });
      } else if (current.direction === 'asc') {
        // Second click: descending
        newMap.set(groupKey, { column, direction: 'desc' });
      } else {
        // Third click: clear sort
        newMap.delete(groupKey);
      }

      return newMap;
    });
  }, []);

  const getSortConfig = useCallback(
    (groupKey: string): SortConfig | undefined => {
      return sortConfigs.get(groupKey);
    },
    [sortConfigs],
  );

  return { toggleSort, getSortConfig };
}
