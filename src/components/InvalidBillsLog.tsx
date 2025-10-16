import type { CsvRecord } from '../types';

interface InvalidBillsLogProps {
  invalidBills: CsvRecord[];
}

export function InvalidBillsLog({ invalidBills }: InvalidBillsLogProps) {
  if (invalidBills.length === 0) return null;

  return (
    <details className="invalid-bills-log">
      <summary className="invalid-bills-summary">
        ⚠️ Invalid Bills ({invalidBills.length}) - Check Console for Details
      </summary>
      <div className="invalid-bills-content">
        <p className="invalid-bills-description">
          These bills are missing required data (property, amount, or vendor) and cannot be
          processed. Open the browser console (F12) to view the full details.
        </p>
        <pre className="invalid-bills-pre">{JSON.stringify(invalidBills, null, 2)}</pre>
      </div>
    </details>
  );
}
