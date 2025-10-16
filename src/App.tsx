import { useCallback, useEffect } from 'react';
import { useTheme, useFileProcessing, useDuplicateDetection } from './hooks';
import { ErrorDisplay, FileInputs, InvalidBillsLog, VendorAccordion } from './components';
import './App.css';

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
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-layout">
          <div className="app-header-content">
            <h1 className="app-title">Duplicate Accounting Finder</h1>
            <p className="app-subtitle">Upload both CSV files, then run detection to find duplicates.</p>
          </div>
          
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="theme-toggle"
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
