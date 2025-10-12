import type { CsvRecord } from '../types';
import { BILLS_CSV_COLUMNS, BUILDIUM_CSV_COLUMNS } from '../constants';
import { formatUSDFromCents, getRaw, getMemoColor, extractMemoNumber } from '../helpers';

interface ResultsTableProps {
  groups: Array<{ key: string; items: CsvRecord[] }>;
  vendorScope?: { vendorRaw: string; vendorNorm: string } | null;
  showHeader?: boolean;
}

export function ResultsTable({ groups, vendorScope = null, showHeader = true }: ResultsTableProps) {
  return (
    <section>
      {showHeader && (
        <>
          <h2 style={{ marginTop: 0 }}>
            {vendorScope ? `Results for ${vendorScope.vendorRaw}` : 'Results'}
          </h2>
          <div role="status" aria-live="polite" aria-atomic="true" style={{ marginBottom: 8 }}>
            {groups.length === 0
              ? 'No duplicates found (or nothing to process).'
              : `${groups.length} duplicate group(s) found.`}
          </div>
        </>
      )}

      {groups.map((group, idx) => (
        <div
          key={group.key}
          style={{
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            padding: 8,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Group {idx + 1} • key: <code>{group.key}</code> • count: {group.items.length}
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 14,
              tableLayout: 'fixed',
            }}
          >
            <colgroup>
              <col style={{ width: '8%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '19%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color-light)', padding: 6 }}>
                  Src
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color-light)', padding: 6 }}>
                  Type
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color-light)', padding: 6 }}>
                  Date
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color-light)', padding: 6 }}>
                  Property
                </th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid var(--border-color-light)', padding: 6 }}>
                  Amount
                </th>
                <th style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color-light)', padding: 6 }}>
                  Color
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color-light)', padding: 6 }}>
                  Memo
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color-light)', padding: 6 }}>
                  Vendor
                </th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((record, i) => {
                const isBills = record.src === 'bills';
                const isBuildium = record.src === 'buildium';
                
                // Determine which column mapping to use based on source
                let dateKey: string | undefined;
                let memoKey: string | undefined;
                
                if (isBills) {
                  dateKey = BILLS_CSV_COLUMNS.date;
                  memoKey = BILLS_CSV_COLUMNS.memo;
                } else {
                  // isBuildium
                  dateKey = BUILDIUM_CSV_COLUMNS.date;
                  memoKey = BUILDIUM_CSV_COLUMNS.memo;
                }
                
                const dateVal = getRaw(record.raw, dateKey);
                const memoVal = String(getRaw(record.raw, memoKey) ?? '');
                const memoColorInfo = getMemoColor(memoVal);
                const memoNumber = extractMemoNumber(memoVal);

                // Determine display label and color
                let sourceLabel = 'To Enter';
                let backgroundColor = 'var(--bg-row-bills)';
                
                if (isBuildium) {
                  sourceLabel = 'Buildium Export';
                  backgroundColor = 'var(--bg-row-buildium)';
                }

                // Determine type label and styling
                // Bill = green, EFT = blue, anything else = red (other payment types)
                const typeValue = record.typeRaw || 'Unknown';
                const isBill = typeValue.toLowerCase() === 'bill';
                const isEFT = typeValue.toLowerCase() === 'eft';
                
                let typeColor: string;
                if (isBill) {
                  typeColor = 'var(--color-bill)';
                } else if (isEFT) {
                  typeColor = 'var(--color-eft)';
                } else {
                  typeColor = 'var(--color-other)';
                }

                // Create tooltip for color swatch
                let colorTooltip = '';
                if (memoColorInfo.source === 'hex') {
                  colorTooltip = `Color from hex code: ${memoColorInfo.color}`;
                } else if (memoColorInfo.source === 'number') {
                  colorTooltip = `Color generated from memo #${memoNumber}`;
                } else {
                  colorTooltip = 'No memo number found';
                }

                return (
                  <tr
                    key={i}
                    style={{
                      backgroundColor,
                    }}
                  >
                    <td style={{ padding: 6 }}>{sourceLabel}</td>
                    <td style={{ padding: 6 }}>
                      <span style={{ 
                        color: typeColor, 
                        fontWeight: 600,
                        fontSize: 12
                      }}>
                        {typeValue}
                      </span>
                    </td>
                    <td style={{ padding: 6 }}>{dateVal}</td>
                    <td style={{ padding: 6 }}>
                      <code>{record.property}</code>
                    </td>
                    <td style={{ padding: 6, textAlign: 'right' }}>
                      {record.amountCents == null ? '' : formatUSDFromCents(Math.abs(record.amountCents))}
                    </td>
                    <td style={{ padding: '6px 12px 6px 6px', textAlign: 'center' }}>
                      {memoColorInfo.source === 'default' ? (
                        <span
                          title={colorTooltip}
                          style={{
                            display: 'inline-block',
                            width: 20,
                            height: 20,
                            fontSize: 16,
                            lineHeight: '20px',
                            textAlign: 'center',
                            cursor: 'help',
                          }}
                          aria-label={colorTooltip}
                        >
                          ⚠️
                        </span>
                      ) : (
                        <span
                          title={colorTooltip}
                          style={{
                            display: 'inline-block',
                            width: 20,
                            height: 20,
                            borderRadius: 3,
                            backgroundColor: memoColorInfo.color,
                            border: '1px solid rgba(0,0,0,0.2)',
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)',
                            cursor: 'help',
                          }}
                          aria-label={colorTooltip}
                        />
                      )}
                    </td>
                    <td style={{ padding: '6px 6px 6px 12px' }}>
                      {memoVal}
                    </td>
                    <td style={{ padding: 6 }}>{record.vendorRaw}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
