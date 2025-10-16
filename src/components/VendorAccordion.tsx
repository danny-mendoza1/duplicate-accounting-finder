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
    <section className="results-section">
      <h2 className="results-title">Results</h2>
      <div role="status" aria-live="polite" aria-atomic="true" className="results-status">
        {vendorGroups.length === 0 ? (
          'No duplicates found (or nothing to process).'
        ) : (
          <>
            <div className="results-summary">
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
            className="vendor-card"
          >
            {/* Vendor Header - Clickable */}
            <button
              onClick={() => toggleVendor(vendorGroup.vendorNorm)}
              className={`vendor-card-header ${isExpanded ? 'vendor-card-header--expanded' : ''}`}
              aria-expanded={isExpanded}
            >
              <div>
                <strong className="vendor-name">{vendorGroup.vendorRaw}</strong>
                <div className="vendor-stats">
                  {vendorGroup.duplicateGroupCount} duplicate group(s) • {vendorGroup.billsCount} bills •{' '}
                  {vendorGroup.buildiumCount} buildium records
                </div>
              </div>
              <span className={`vendor-expand-icon ${isExpanded ? 'vendor-expand-icon--expanded' : ''}`}>
                ▼
              </span>
            </button>

            {/* Vendor Details - Expandable */}
            {isExpanded && (
              <div className="vendor-card-body">
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
