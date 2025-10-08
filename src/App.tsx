import { useState, useCallback, useEffect } from 'react';
import { parseJsonText, parseCsvText, createAppError } from './helpers';
import { CSV_COLS, JSON_COLS } from './constants';
import { buildGroups } from './core';
import type { AnyRecord, RawRow, AppError, ErrorType } from './types';
import { ERROR_TYPES } from './types';
import { DebugPreview, ErrorDisplay, FileInputs, ResultsTable } from './components';

export default function App() {
  const [jsonText, setJsonText] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<AppError | null>(null);
  const [droppedRowCount, setDroppedRowCount] = useState<number>(0);
  const [duplicateGroups, setDuplicateGroups] = useState<
    Array<{ key: string; items: AnyRecord[] }>
  >([]);

  // Debug preview state
  const [csvColumnKeys, setCsvColumnKeys] = useState<string[]>([]);
  const [jsonColumnKeys, setJsonColumnKeys] = useState<string[]>([]);
  const [firstRowPreview, setFirstRowPreview] = useState<RawRow | null>(null);
  const [vendorScope, setVendorScope] = useState<{ vendorRaw: string; vendorNorm: string } | null>(
    null,
  );

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setLoadingMessage('Starting...');
    setError(null);
    setDuplicateGroups([]);
    setDroppedRowCount(0);

    try {
      // 1) Parse
      setLoadingMessage('Parsing data files...');
      const allCsvRecords = csvFile ? parseCsvText(await csvFile.text(), CSV_COLS) : [];
      const allJsonRecords = jsonText.trim() ? parseJsonText(jsonText, JSON_COLS) : [];

      // 2) Debug view uses RAW payloads
      setCsvColumnKeys(
        allCsvRecords[0] ? Object.keys(allCsvRecords[0].raw as Record<string, unknown>) : [],
      );
      setJsonColumnKeys(
        allJsonRecords[0] ? Object.keys(allJsonRecords[0].raw as Record<string, unknown>) : [],
      );
      setFirstRowPreview(
        (allCsvRecords[0]?.raw as RawRow) ?? (allJsonRecords[0]?.raw as RawRow) ?? null,
      );

      if (allCsvRecords.length === 0 && allJsonRecords.length === 0) {
        setError(
          createAppError(
            ERROR_TYPES.EMPTY_INPUT,
            'No input provided',
            'Paste JSON data in the textarea, select a CSV file, or provide both to find duplicates.',
          ),
        );
        return;
      }

      // 3) Determine vendor from JSON payload ("PayeeName") and scope CSV to it
      setLoadingMessage('Analyzing vendor data...');
      const jsonRecordWithVendor = allJsonRecords.find(
        (record) => record.vendorRaw && record.vendorRaw.trim(),
      );
      const scope = jsonRecordWithVendor
        ? { vendorRaw: jsonRecordWithVendor.vendorRaw, vendorNorm: jsonRecordWithVendor.vendorNorm }
        : null;
      setVendorScope(scope);

      const scopedCsvRecords = scope
        ? allCsvRecords.filter((record) => record.vendorNorm === scope.vendorNorm)
        : allCsvRecords;

      if (scope && scopedCsvRecords.length === 0) {
        setError(
          createAppError(
            ERROR_TYPES.VENDOR_SCOPE_ERROR,
            `No CSV rows found for vendor "${scope.vendorRaw}"`,
            "Verify that the vendor name in your CSV 'Vendor' column matches the 'PayeeName' in your JSON data. Check for differences in capitalization, spacing, or special characters.",
            `Looking for vendor: "${scope.vendorRaw}" (normalized: "${scope.vendorNorm}")`,
          ),
        );
        return;
      }

      // 4) Filter unusable rows (after vendor scoping)
      const usableCsvRecords = scopedCsvRecords.filter(
        (r) => r.property !== '' && r.amountCents !== null,
      );
      const usableJsonRecords = allJsonRecords.filter(
        (r) => r.property !== '' && r.amountCents !== null,
      );
      setDroppedRowCount(
        scopedCsvRecords.length +
          allJsonRecords.length -
          (usableCsvRecords.length + usableJsonRecords.length),
      );

      // 5) Group only keys that exist in CSV & JSON
      setLoadingMessage('Finding duplicates...');
      const groupedDuplicates = buildGroups(usableJsonRecords, usableCsvRecords);

      const uiGroups = groupedDuplicates.map((group) => ({
        key: group.key,
        items: [...group.csvRows, ...group.jsonRows] as AnyRecord[],
      }));

      setDuplicateGroups(uiGroups);
    } catch (e: unknown) {
      if (e instanceof Error) {
        // Determine error type based on message content
        let errorType: ErrorType = ERROR_TYPES.PARSING_ERROR;
        let suggestion =
          'Check that your data format is correct and all required columns are present.';

        if (e.message.includes('JSON')) {
          suggestion = 'Verify your JSON is valid. Try pasting it into a JSON validator first.';
        } else if (e.message.includes('CSV')) {
          suggestion = 'Ensure your CSV has the required columns: Property, Amount, and Vendor.';
        } else if (e.message.includes('missing required columns')) {
          errorType = ERROR_TYPES.VALIDATION_ERROR;
          suggestion =
            'Check that your file contains columns named: Property, Amount, and Vendor (case-sensitive).';
        }

        setError(createAppError(errorType, e.message, suggestion));
      } else {
        setError(
          createAppError(
            ERROR_TYPES.PARSING_ERROR,
            'An unexpected error occurred',
            'Try refreshing the page and uploading your files again. If the problem persists, check your data format.',
          ),
        );
      }
    } finally {
      setIsRunning(false);
      setLoadingMessage('');
    }
  }, [jsonText, csvFile]);

  // Keyboard shortcut: Ctrl/Cmd + Enter to run
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isRunning) {
        e.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleRun, isRunning]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Duplicate Accounting Finder (MVP)</h1>
        <p style={{ margin: '4px 0 0' }}>Paste JSON, upload CSV, then run detection.</p>
      </header>

      <FileInputs
        jsonText={jsonText}
        onJsonTextChange={setJsonText}
        onCsvFileChange={setCsvFile}
        isRunning={isRunning}
        loadingMessage={loadingMessage}
        onRun={handleRun}
      />

      <DebugPreview
        firstPreview={firstRowPreview}
        csvKeys={csvColumnKeys}
        jsonKeys={jsonColumnKeys}
      />

      <ErrorDisplay error={error} droppedCount={droppedRowCount} />

      <ResultsTable groups={duplicateGroups} vendorScope={vendorScope} />
    </div>
  );
}
