import { useState } from 'react';

interface VendorsWithoutDuplicatesTableProps {
  vendors: string[];
}

export function VendorsWithoutDuplicatesTable({ vendors }: VendorsWithoutDuplicatesTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (vendors.length === 0) return null;

  const sortedVendors = [...vendors].sort();

  return (
    <div className="vendors-without-duplicates">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`vendors-without-duplicates-header ${isExpanded ? 'vendors-without-duplicates-header--expanded' : ''}`}
        aria-expanded={isExpanded}
      >
        <div>
          <strong className="vendors-without-duplicates-title">
            Vendors Processed Without Duplicates ({vendors.length})
          </strong>
        </div>
        <span className={`vendor-expand-icon ${isExpanded ? 'vendor-expand-icon--expanded' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expandable Table */}
      {isExpanded && (
        <div className="vendors-without-duplicates-body">
          <table className="vendors-table">
            <thead>
              <tr>
                <th>Vendor Name</th>
              </tr>
            </thead>
            <tbody>
              {sortedVendors.map((vendor, idx) => (
                <tr key={idx}>
                  <td>{vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
