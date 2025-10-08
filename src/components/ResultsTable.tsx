import type { AnyRecord } from '../types';
import { CSV_COLS, JSON_COLS } from '../constants';
import { BUILDIUM_CSV_COLUMNS } from '../types';
import { formatUSDFromCents, getRaw, findHexInMemo } from '../helpers';

interface ResultsTableProps {
  groups: Array<{ key: string; items: AnyRecord[] }>;
  vendorScope: { vendorRaw: string; vendorNorm: string } | null;
}

export default function ResultsTable({ groups, vendorScope }: ResultsTableProps) {
  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Results for {vendorScope?.vendorRaw}</h2>
      <div role="status" aria-live="polite" aria-atomic="true" style={{ marginBottom: 8 }}>
        {groups.length === 0
          ? 'No duplicates found (or nothing to process).'
          : `${groups.length} duplicate group(s) found.`}
      </div>

      {groups.map((group, idx) => (
        <div
          key={group.key}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 8,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
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
              <col style={{ width: '20%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '32%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>
                  Src
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>
                  Type
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>
                  Date
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>
                  Property
                </th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 6 }}>
                  Amount
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>
                  Memo
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>
                  Vendor
                </th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((record, i) => {
                const isBills = record.src === 'bills';
                const isBuildium = record.src === 'buildium';
                const isJson = record.src === 'json';
                
                // Determine which column mapping to use based on source
                let dateKey: string | undefined;
                let memoKey: string | undefined;
                
                if (isBills) {
                  dateKey = CSV_COLS.date;
                  memoKey = CSV_COLS.memo;
                } else if (isBuildium) {
                  dateKey = BUILDIUM_CSV_COLUMNS.date;
                  memoKey = BUILDIUM_CSV_COLUMNS.memo;
                } else {
                  // isJson
                  dateKey = JSON_COLS.date;
                  memoKey = JSON_COLS.memo;
                }
                
                const dateVal = getRaw(record.raw, dateKey);
                const memoVal = String(getRaw(record.raw, memoKey) ?? '');
                const hex = findHexInMemo(memoVal);

                // Determine display label and color
                let sourceLabel = 'To Enter';
                let backgroundColor = 'var(--bg-row-bills)';
                
                if (isBuildium) {
                  sourceLabel = 'Buildium Export';
                  backgroundColor = 'var(--bg-row-buildium)';
                } else if (isJson) {
                  sourceLabel = 'Buildium';
                  backgroundColor = 'var(--bg-row-buildium)';
                }

                // Determine type label and styling
                const isPayment = record.typeRaw === 'EFT' || record.typeRaw === 'Payment';
                const typeLabel = isPayment ? 'EFT' : 'Bill';
                const typeColor = isPayment ? 'var(--color-eft)' : 'var(--color-bill)';

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
                        {typeLabel}
                      </span>
                    </td>
                    <td style={{ padding: 6 }}>{dateVal}</td>
                    <td style={{ padding: 6 }}>
                      <code>{record.property}</code>
                    </td>
                    <td style={{ padding: 6, textAlign: 'right' }}>
                      {record.amountCents == null ? '' : formatUSDFromCents(Math.abs(record.amountCents))}
                    </td>
                    <td style={{ padding: 6 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        {hex && (
                          <span
                            title={hex}
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: 3,
                              backgroundColor: hex,
                              border: '1px solid rgba(0,0,0,0.1)',
                              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)',
                            }}
                            aria-label={`Color indicator: ${hex}`}
                          />
                        )}
                        <span>{memoVal}</span>
                      </span>
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
