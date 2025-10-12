interface FileInputsProps {
  onCsvFileChange: (file: File | null) => void;
  onBuildiumCsvFileChange: (file: File | null) => void;
  isRunning: boolean;
  loadingMessage?: string;
  onRun: () => void;
}

export function FileInputs({
  onCsvFileChange,
  onBuildiumCsvFileChange,
  isRunning,
  loadingMessage,
  onRun,
}: FileInputsProps) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 12 }}>
      <label htmlFor="bills-csv-input">
        <div style={{ fontSize: 12, marginBottom: 4, fontWeight: "bold" }}>
          Upload CSV #1: Bills to Enter (Vendor Invoices)
        </div>
        <input
          id="bills-csv-input"
          type="file"
          accept=".csv"
          onChange={(e) => onCsvFileChange(e.target.files?.[0] ?? null)}
          aria-label="CSV file upload for bills to enter"
        />
      </label>

      <label htmlFor="buildium-csv-input">
        <div style={{ fontSize: 12, marginBottom: 4, fontWeight: "bold" }}>
          Upload CSV #2: Buildium Export
        </div>
        <input
          id="buildium-csv-input"
          type="file"
          accept=".csv"
          onChange={(e) => onBuildiumCsvFileChange(e.target.files?.[0] ?? null)}
          aria-label="CSV file upload for Buildium export"
        />
      </label>

      <div>
        <button
          onClick={onRun}
          disabled={isRunning}
          aria-busy={isRunning}
          title="Press Ctrl+Enter (Cmd+Enter on Mac) to run"
        >
          {isRunning ? "Running…" : "Find duplicates"}
        </button>
        <span style={{ marginLeft: 8, fontSize: 12, color: "#666" }}>
          or press Ctrl+Enter
        </span>
        {isRunning && loadingMessage && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#555",
              fontStyle: "italic"
            }}
          >
            {loadingMessage}
          </div>
        )}
      </div>
    </section>
  );
}
