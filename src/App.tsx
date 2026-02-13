import { useCallback, useEffect, useState } from 'react';
import { useTheme, useFileProcessing, useDuplicateDetection } from './hooks';
import { ErrorDisplay, FileInputs, InvalidBillsLog, VendorAccordion } from './components';
import { loadDemoFiles } from './helpers';
import './App.css';

export default function App() {
  const [isDemoLoading, setIsDemoLoading] = useState(false);
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

  const handleRunDemo = async () => {
    setIsDemoLoading(true);
    resetDuplicates();
    
    try {
      const { billsFile, buildiumFile } = await loadDemoFiles();
      
      setCsvFile(billsFile);
      setBuildiumCsvFile(buildiumFile);
      
      const result = await parseFiles(billsFile, buildiumFile);
      if (result) {
        findDuplicates(result.billsRecords, result.buildiumRecords);
      }
    } catch (error) {
      console.error('Failed to load demo files:', error);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setCsvFile(null);
    setBuildiumCsvFile(null);
    
    resetDuplicates();
  }, [setCsvFile, setBuildiumCsvFile, resetDuplicates]);

  const hasFiles = csvFile !== null || buildiumCsvFile !== null;
  const hasResults = vendorGroups.length > 0 || vendorsWithoutDuplicates.length > 0 || invalidBills.length > 0;
  const shouldShowReset = hasFiles || hasResults || error !== null;

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
    <>
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="theme-toggle"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="app-container">
        <div className="content-wrapper">
          <header className="app-header">
            <h1 className="app-title">Duplicate Accounting Finder</h1>
            <p className="app-subtitle">
              Upload both CSV files, then run detection to find duplicates.
            </p>
            <button 
              className="file-input-button"
              onClick={handleRunDemo}
              disabled={isDemoLoading || isRunning}
              aria-busy={isDemoLoading}
            >
              {isDemoLoading ? 'Running demo…' : 'Or run a demo scenario'}
            </button>
          </header>

          <FileInputs
            onCsvFileChange={setCsvFile}
            onBuildiumCsvFileChange={setBuildiumCsvFile}
            isRunning={isRunning}
            loadingMessage={loadingMessage}
            onRun={handleRun}
            onReset={handleReset}
            showReset={shouldShowReset}
          />

          <ErrorDisplay error={error} />

          <VendorAccordion
            vendorGroups={vendorGroups}
            vendorsWithoutDuplicates={vendorsWithoutDuplicates}
          />

          <InvalidBillsLog invalidBills={invalidBills} />
        </div>
      </div>
    </>
  );
}
