import { useState } from 'react';

interface VendorsWithoutDuplicatesTableProps {
  vendors: string[];
}

export default function VendorsWithoutDuplicatesTable({ vendors }: VendorsWithoutDuplicatesTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (vendors.length === 0) return null;

  const sortedVendors = [...vendors].sort();

  return (
    <div
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 12,
      }}
    >
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
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
          <strong style={{ fontSize: 14 }}>
            Vendors Processed Without Duplicates ({vendors.length})
          </strong>
        </div>
        <span
          style={{
            fontSize: 16,
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </span>
      </button>

      {/* Expandable Table */}
      {isExpanded && (
        <div style={{ padding: 12, borderTop: '1px solid var(--border-color)' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 14,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    borderBottom: '1px solid var(--border-color-light)',
                    padding: '6px 12px',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  Vendor Name
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVendors.map((vendor, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < sortedVendors.length - 1 ? '1px solid var(--border-color-light)' : 'none',
                  }}
                >
                  <td style={{ padding: '8px 12px' }}>{vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
