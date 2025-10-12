import { useState, useMemo } from 'react';
import type { VendorGroup } from '../types';
import { ResultsTable } from './ResultsTable';
import { VendorsWithoutDuplicatesTable } from './VendorsWithoutDuplicatesTable';

interface VendorAccordionProps {
  vendorGroups: VendorGroup[];
  vendorsWithoutDuplicates?: string[];
}

export function VendorAccordion({ vendorGroups, vendorsWithoutDuplicates = [] }: VendorAccordionProps) {
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set());

  const totalDuplicateGroups = useMemo(
    () => vendorGroups.reduce((sum, v) => sum + v.duplicateGroupCount, 0),
    [vendorGroups]
  );

  // Memoize the transformed vendor groups to avoid recreating on every render
  const transformedVendorGroups = useMemo(
    () => vendorGroups.map((vendorGroup) => ({
      ...vendorGroup,
      transformedGroups: vendorGroup.groups.map((group) => ({
        key: group.key,
        items: [...group.billsRows, ...group.buildiumRows],
      })),
    })),
    [vendorGroups]
  );

  const toggleVendor = (vendorNorm: string) => {
    setExpandedVendors((prev) => {
      const next = new Set(prev);
      if (next.has(vendorNorm)) {
        next.delete(vendorNorm);
      } else {
        next.add(vendorNorm);
      }
      return next;
    });
  };

  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Results</h2>
      <div role="status" aria-live="polite" aria-atomic="true" style={{ marginBottom: 16 }}>
        {vendorGroups.length === 0 ? (
          'No duplicates found (or nothing to process).'
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>
              <strong>{totalDuplicateGroups} duplicate group(s)</strong> found across{' '}
              <strong>{vendorGroups.length} vendor(s)</strong>
            </div>
          </>
        )}
      </div>

      {/* Vendors with duplicates */}
      {transformedVendorGroups.map((vendorGroup) => {
        const isExpanded = expandedVendors.has(vendorGroup.vendorNorm);

        return (
          <div
            key={vendorGroup.vendorNorm}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            {/* Vendor Header - Clickable */}
            <button
              onClick={() => toggleVendor(vendorGroup.vendorNorm)}
              style={{
                width: '100%',
                padding: 12,
                background: isExpanded ? 'var(--bg-row-buildium)' : 'var(--bg-secondary)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'inherit',
                fontSize: 'inherit',
              }}
              aria-expanded={isExpanded}
            >
              <div>
                <strong style={{ fontSize: 16 }}>{vendorGroup.vendorRaw}</strong>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {vendorGroup.duplicateGroupCount} duplicate group(s) • {vendorGroup.billsCount} bills •{' '}
                  {vendorGroup.buildiumCount} buildium records
                </div>
              </div>
              <span style={{ fontSize: 20, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </button>

            {/* Vendor Details - Expandable */}
            {isExpanded && (
              <div style={{ padding: 12, borderTop: '1px solid var(--border-color)' }}>
                <ResultsTable
                  groups={vendorGroup.transformedGroups}
                  showHeader={false}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Vendors without duplicates */}
      <VendorsWithoutDuplicatesTable vendors={vendorsWithoutDuplicates} />
    </section>
  );
}
