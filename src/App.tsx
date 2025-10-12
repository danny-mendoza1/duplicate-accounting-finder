import { useState, useCallback, useEffect } from 'react';
import { parseJsonText, parseCsvText, createAppError } from './helpers';
import { CSV_COLS, JSON_COLS } from './constants';
import { BUILDIUM_CSV_COLUMNS } from './types';
import { buildGroups, buildGroupsCsvToCsv, groupByVendor } from './core';
import type { AnyRecord, RawRow, AppError, ErrorType, ComparisonMode, VendorGroup } from './types';
import { ERROR_TYPES } from './types';
import { DebugPreview, ErrorDisplay, FileInputs, ResultsTable, VendorAccordion } from './components';

type Theme = 'light' | 'dark';

export default function App() {
  // Theme management - default to dark
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    return (stored === 'light' || stored === 'dark') ? stored : 'dark';
  });

  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('csv-csv');
  const [jsonText, setJsonText] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [buildiumCsvFile, setBuildiumCsvFile] = useState<File | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<AppError | null>(null);
  const [droppedRowCount, setDroppedRowCount] = useState<number>(0);
  const [duplicateGroups, setDuplicateGroups] = useState<
    Array<{ key: string; items: AnyRecord[] }>
  >([]);
  const [vendorGroups, setVendorGroups] = useState<VendorGroup[]>([]);
  const [vendorsWithoutDuplicates, setVendorsWithoutDuplicates] = useState<string[]>([]);

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
    setVendorGroups([]);
    setVendorsWithoutDuplicates([]);
    setDroppedRowCount(0);

    try {
      if (comparisonMode === 'csv-csv') {
        // CSV+CSV comparison mode
        setLoadingMessage('Parsing CSV files...');
        
        if (!csvFile || !buildiumCsvFile) {
          setError(
            createAppError(
              ERROR_TYPES.EMPTY_INPUT,
              'Missing CSV files',
              'Both CSV files are required for CSV+CSV comparison mode. Please upload both "Bills to Enter" and "Buildium Export" CSV files.',
            ),
          );
          return;
        }

        const billsRecords = parseCsvText(await csvFile.text(), CSV_COLS, 'bills');
        const buildiumRecords = parseCsvText(await buildiumCsvFile.text(), BUILDIUM_CSV_COLUMNS, 'buildium');

        // Debug preview
        setCsvColumnKeys(
          billsRecords[0] ? Object.keys(billsRecords[0].raw as Record<string, unknown>) : [],
        );
        setJsonColumnKeys(
          buildiumRecords[0] ? Object.keys(buildiumRecords[0].raw as Record<string, unknown>) : [],
        );
        setFirstRowPreview(
          (billsRecords[0]?.raw as RawRow) ?? (buildiumRecords[0]?.raw as RawRow) ?? null,
        );

        // No longer scoping to single vendor - process all vendors
        setVendorScope(null);

        // Filter unusable rows
        setLoadingMessage('Filtering data...');
        const usableBillsRecords = billsRecords.filter(
          (r) => r.property !== '' && r.amountCents !== null,
        );
        const usableBuildiumRecords = buildiumRecords.filter(
          (r) => r.property !== '' && r.amountCents !== null,
        );
        setDroppedRowCount(
          billsRecords.length +
            buildiumRecords.length -
            (usableBillsRecords.length + usableBuildiumRecords.length),
        );

        // Find duplicates between the two CSVs (now includes vendor in matching key)
        setLoadingMessage('Finding duplicates...');
        const groupedDuplicates = buildGroupsCsvToCsv(usableBillsRecords, usableBuildiumRecords);

        // Organize results by vendor
        setLoadingMessage('Organizing by vendor...');
        const vendorGroupsResult = groupByVendor(groupedDuplicates, usableBillsRecords, usableBuildiumRecords);
        
        // Identify vendors without duplicates
        const allVendorsProcessed = new Set<string>();
        for (const record of usableBillsRecords) {
          if (record.vendorNorm) allVendorsProcessed.add(record.vendorNorm);
        }
        for (const record of usableBuildiumRecords) {
          if (record.vendorNorm) allVendorsProcessed.add(record.vendorNorm);
        }
        
        const vendorsWithDuplicatesSet = new Set(vendorGroupsResult.map(vg => vg.vendorNorm));
        const vendorsWithoutDups: string[] = [];
        for (const vendorNorm of allVendorsProcessed) {
          if (!vendorsWithDuplicatesSet.has(vendorNorm)) {
            const billRecord = usableBillsRecords.find(r => r.vendorNorm === vendorNorm);
            const buildiumRecord = usableBuildiumRecords.find(r => r.vendorNorm === vendorNorm);
            const vendorRaw = billRecord?.vendorRaw || buildiumRecord?.vendorRaw || vendorNorm;
            vendorsWithoutDups.push(vendorRaw);
          }
        }
        
        setVendorGroups(vendorGroupsResult);
        setVendorsWithoutDuplicates(vendorsWithoutDups);
      } else {
        // JSON+CSV comparison mode (legacy)
        setLoadingMessage('Parsing data files...');
        const allCsvRecords = csvFile ? parseCsvText(await csvFile.text(), CSV_COLS, 'bills') : [];
        const allJsonRecords = jsonText.trim() ? parseJsonText(jsonText, JSON_COLS) : [];

        // Debug view uses RAW payloads
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

        // Determine vendor from JSON payload ("PayeeName") and scope CSV to it
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

        // Filter unusable rows (after vendor scoping)
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

        // Group only keys that exist in CSV & JSON
        setLoadingMessage('Finding duplicates...');
        const groupedDuplicates = buildGroups(usableJsonRecords, usableCsvRecords);

        const uiGroups = groupedDuplicates.map((group) => ({
          key: group.key,
          items: [...group.csvRows, ...group.jsonRows] as AnyRecord[],
        }));

        setDuplicateGroups(uiGroups);
      }
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
  }, [jsonText, csvFile, buildiumCsvFile, comparisonMode]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0 }}>Duplicate Accounting Finder</h1>
            <p style={{ margin: '4px 0 0' }}>Choose comparison mode, either Paste JSON and upload CSV or upload both CSVs, then run detection.</p>
          </div>
          
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              padding: '8px 12px',
              fontSize: '18px',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <FileInputs
        jsonText={jsonText}
        onJsonTextChange={setJsonText}
        onCsvFileChange={setCsvFile}
        onBuildiumCsvFileChange={setBuildiumCsvFile}
        isRunning={isRunning}
        loadingMessage={loadingMessage}
        onRun={handleRun}
        comparisonMode={comparisonMode}
        onComparisonModeChange={setComparisonMode}
      />

      <DebugPreview
        firstPreview={firstRowPreview}
        csvKeys={csvColumnKeys}
        jsonKeys={jsonColumnKeys}
      />

      <ErrorDisplay error={error} droppedCount={droppedRowCount} />

      {comparisonMode === 'csv-csv' ? (
        <VendorAccordion 
          vendorGroups={vendorGroups} 
          vendorsWithoutDuplicates={vendorsWithoutDuplicates}
        />
      ) : (
        <ResultsTable groups={duplicateGroups} vendorScope={vendorScope} />
      )}
    </div>
  );
}
