import type { CsvRecord } from '../types';

interface InvalidBillsLogProps {
  invalidBills: CsvRecord[];
}

export default function InvalidBillsLog({ invalidBills }: InvalidBillsLogProps) {
  if (invalidBills.length === 0) return null;

  return (
    <details style={{ marginTop: 16, padding: 12, border: '1px solid var(--border-color)', borderRadius: 8 }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
        ⚠️ Invalid Bills ({invalidBills.length}) - Check Console for Details
      </summary>
      <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
        <p style={{ margin: '0 0 8px' }}>
          These bills are missing required data (property, amount, or vendor) and cannot be processed.
          Open the browser console (F12) to view the full details.
        </p>
        <pre style={{ 
          fontSize: 12, 
          overflow: 'auto', 
          padding: 12, 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 4,
          maxHeight: 300
        }}>
          {JSON.stringify(invalidBills, null, 2)}
        </pre>
      </div>
    </details>
  );
}
