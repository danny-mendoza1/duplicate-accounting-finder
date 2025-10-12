import { useCallback, useEffect } from 'react';
import { useTheme, useFileProcessing, useDuplicateDetection } from './hooks';
import { ErrorDisplay, FileInputs, InvalidBillsLog, VendorAccordion } from './components';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    csvFile,
    setCsvFile,
    buildiumCsvFile,
    setBuildiumCsvFile,
    isRunning,
    loadingMessage,
    error,
    parseFiles,
  } = useFileProcessing();
  
  const {
    vendorGroups,
    vendorsWithoutDuplicates,
    invalidBills,
    findDuplicates,
    reset: resetDuplicates,
  } = useDuplicateDetection();

  const handleRun = useCallback(async () => {
    resetDuplicates();
    
    const result = await parseFiles(csvFile, buildiumCsvFile);
    if (!result) return;
    
    findDuplicates(result.billsRecords, result.buildiumRecords);
  }, [csvFile, buildiumCsvFile, parseFiles, findDuplicates, resetDuplicates]);

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
            <p style={{ margin: '4px 0 0' }}>Upload both CSV files, then run detection to find duplicates.</p>
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
        onCsvFileChange={setCsvFile}
        onBuildiumCsvFileChange={setBuildiumCsvFile}
        isRunning={isRunning}
        loadingMessage={loadingMessage}
        onRun={handleRun}
      />

      <ErrorDisplay error={error} />

      <VendorAccordion 
        vendorGroups={vendorGroups} 
        vendorsWithoutDuplicates={vendorsWithoutDuplicates}
      />

      <InvalidBillsLog invalidBills={invalidBills} />
    </div>
  );
}
