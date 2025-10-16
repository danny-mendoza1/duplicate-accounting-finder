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
          <h2 className="results-title">
            {vendorScope ? `Results for ${vendorScope.vendorRaw}` : 'Results'}
          </h2>
          <div role="status" aria-live="polite" aria-atomic="true" className="results-summary">
            {groups.length === 0
              ? 'No duplicates found (or nothing to process).'
              : `${groups.length} duplicate group(s) found.`}
          </div>
        </>
      )}

      {groups.map((group, idx) => (
        <div
          key={group.key}
          className="duplicate-group-card"
        >
          <div className="duplicate-group-info">
            Group {idx + 1} • key: <code>{group.key}</code> • count: {group.items.length}
          </div>
          <table className="duplicate-table">
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
                <th>
                  Src
                </th>
                <th>
                  Type
                </th>
                <th>
                  Date
                </th>
                <th>
                  Property
                </th>
                <th className="align-right">
                  Amount
                </th>
                <th className="align-center">
                  Color
                </th>
                <th>
                  Memo
                </th>
                <th>
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

                // Determine display label
                let sourceLabel = 'To Enter';
                
                if (isBuildium) {
                  sourceLabel = 'Buildium Export';
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

                const rowClass = isBills ? 'row-bills' : 'row-buildium';

                return (
                  <tr
                    key={i}
                    className={rowClass}
                  >
                    <td>{sourceLabel}</td>
                    <td>
                      <span 
                        style={{ color: typeColor }}
                        className="type-badge"
                      >
                        {typeValue}
                      </span>
                    </td>
                    <td>{dateVal}</td>
                    <td>
                      <code>{record.property}</code>
                    </td>
                    <td className="align-right">
                      {record.amountCents == null ? '' : formatUSDFromCents(Math.abs(record.amountCents))}
                    </td>
                    <td className="color-column">
                      {memoColorInfo.source === 'default' ? (
                        <span
                          title={colorTooltip}
                          className="color-swatch-warning"
                          aria-label={colorTooltip}
                        >
                          ⚠️
                        </span>
                      ) : (
                        <span
                          title={colorTooltip}
                          style={{
                            backgroundColor: memoColorInfo.color,
                          }}
                          className="color-swatch"
                          aria-label={colorTooltip}
                        />
                      )}
                    </td>
                    <td className="memo-column">
                      {memoVal}
                    </td>
                    <td>{record.vendorRaw}</td>
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
