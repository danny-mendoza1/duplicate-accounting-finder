import { useState, useRef } from 'react';

interface FileInputsProps {
  onCsvFileChange: (file: File | null) => void;
  onBuildiumCsvFileChange: (file: File | null) => void;
  isRunning: boolean;
  loadingMessage?: string;
  onRun: () => void;
  onReset?: () => void;
  showReset?: boolean;
}

// Helper to truncate long filenames
function truncateFilename(filename: string, maxLength: number = 30): string {
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.slice(filename.lastIndexOf('.'));
  const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));
  const keepStart = Math.floor((maxLength - extension.length - 3) * 0.6);
  const keepEnd = Math.floor((maxLength - extension.length - 3) * 0.4);
  
  return `${nameWithoutExt.slice(0, keepStart)}...${nameWithoutExt.slice(-keepEnd)}${extension}`;
}

export function FileInputs({
  onCsvFileChange,
  onBuildiumCsvFileChange,
  isRunning,
  loadingMessage,
  onRun,
  onReset,
  showReset = false,
}: FileInputsProps) {
  const [billsFile, setBillsFile] = useState<File | null>(null);
  const [buildiumFile, setBuildiumFile] = useState<File | null>(null);
  
  const billsInputRef = useRef<HTMLInputElement>(null);
  const buildiumInputRef = useRef<HTMLInputElement>(null);

  const handleBillsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBillsFile(file);
    onCsvFileChange(file);
  };

  const handleBuildiumFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBuildiumFile(file);
    onBuildiumCsvFileChange(file);
  };

  const clearBillsFile = () => {
    setBillsFile(null);
    onCsvFileChange(null);
    if (billsInputRef.current) {
      billsInputRef.current.value = '';
    }
  };

  const clearBuildiumFile = () => {
    setBuildiumFile(null);
    onBuildiumCsvFileChange(null);
    if (buildiumInputRef.current) {
      buildiumInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setBillsFile(null);
    setBuildiumFile(null);
    
    if (billsInputRef.current) {
      billsInputRef.current.value = '';
    }
    if (buildiumInputRef.current) {
      buildiumInputRef.current.value = '';
    }
    
    // Call parent reset handler
    onReset?.();
  };

  return (
    <section className="file-inputs-section">
      <div className="file-input-group">
        <label htmlFor="bills-csv-input" className="file-input-label-text">
          Upload CSV #1: Bills to Enter (Vendor Invoices)
        </label>
        <div className="file-input-row">
          <input
            ref={billsInputRef}
            id="bills-csv-input"
            type="file"
            accept=".csv"
            onChange={handleBillsFileChange}
            aria-label="CSV file upload for bills to enter"
            className="file-input-hidden"
          />
          <label htmlFor="bills-csv-input" className="file-input-button">
            Choose File
          </label>
          
          <div className="file-status">
            {billsFile ? (
              <>
                <span className="file-status-icon" aria-label="File uploaded">✓</span>
                <span 
                  className="file-status-name" 
                  title={billsFile.name}
                >
                  {truncateFilename(billsFile.name)}
                </span>
                <button
                  type="button"
                  onClick={clearBillsFile}
                  className="file-status-remove"
                  aria-label="Remove file"
                  title="Remove file"
                >
                  ×
                </button>
              </>
            ) : (
              <span className="file-status-empty">No file selected</span>
            )}
          </div>
        </div>
      </div>

      <div className="file-input-group">
        <label htmlFor="buildium-csv-input" className="file-input-label-text">
          Upload CSV #2: Buildium Export
        </label>
        <div className="file-input-row">
          <input
            ref={buildiumInputRef}
            id="buildium-csv-input"
            type="file"
            accept=".csv"
            onChange={handleBuildiumFileChange}
            aria-label="CSV file upload for Buildium export"
            className="file-input-hidden"
          />
          <label htmlFor="buildium-csv-input" className="file-input-button">
            Choose File
          </label>
          
          <div className="file-status">
            {buildiumFile ? (
              <>
                <span className="file-status-icon" aria-label="File uploaded">✓</span>
                <span 
                  className="file-status-name"
                  title={buildiumFile.name}
                >
                  {truncateFilename(buildiumFile.name)}
                </span>
                <button
                  type="button"
                  onClick={clearBuildiumFile}
                  className="file-status-remove"
                  aria-label="Remove file"
                  title="Remove file"
                >
                  ×
                </button>
              </>
            ) : (
              <span className="file-status-empty">No file selected</span>
            )}
          </div>
        </div>
      </div>

      <div className="file-input-actions">
        <button
          onClick={onRun}
          disabled={isRunning}
          aria-busy={isRunning}
          title="Press Ctrl+Enter (Cmd+Enter on Mac) to run"
          className="primary-button"
        >
          {isRunning ? 'Running…' : 'Find duplicates'}
        </button>
        {showReset && (
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="secondary-button"
            title="Clear all files and results"
          >
            Reset
          </button>
        )}
        <span className="button-hint">or press Ctrl+Enter</span>
        {isRunning && loadingMessage && (
          <div role="status" aria-live="polite" className="loading-message">
            {loadingMessage}
          </div>
        )}
      </div>
    </section>
  );
}
