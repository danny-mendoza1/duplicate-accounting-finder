import { useState, useEffect } from "react";
import type { ComparisonMode } from "../types";

interface FileInputsProps {
  jsonText: string;
  onJsonTextChange: (text: string) => void;
  onCsvFileChange: (file: File | null) => void;
  onBuildiumCsvFileChange: (file: File | null) => void;
  isRunning: boolean;
  loadingMessage?: string;
  onRun: () => void;
  comparisonMode: ComparisonMode;
  onComparisonModeChange: (mode: ComparisonMode) => void;
}

export default function FileInputs({
  jsonText,
  onJsonTextChange,
  onCsvFileChange,
  onBuildiumCsvFileChange,
  isRunning,
  loadingMessage,
  onRun,
  comparisonMode,
  onComparisonModeChange
}: FileInputsProps) {
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Validate JSON in real-time
  useEffect(() => {
    if (!jsonText.trim()) {
      setJsonError(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setJsonError("JSON must be an array of objects");
      } else {
        setJsonError(null);
      }
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON format");
    }
  }, [jsonText]);

  return (
    <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 12 }}>
      <div style={{ 
        padding: "12px", 
        backgroundColor: "var(--toggle-bg)", 
        border: "1px solid var(--toggle-border)",
        borderRadius: "4px",
        marginBottom: "4px"
      }}>
        <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "var(--text-primary)" }}>
          Comparison Mode
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "4px",
            border: comparisonMode === "json-csv" ? "2px solid var(--toggle-selected-border)" : "2px solid var(--toggle-border)",
            backgroundColor: comparisonMode === "json-csv" ? "var(--toggle-selected-bg)" : "var(--toggle-bg)",
            transition: "all 0.2s ease"
          }}>
            <input
              type="radio"
              name="comparison-mode"
              value="json-csv"
              checked={comparisonMode === "json-csv"}
              onChange={() => onComparisonModeChange("json-csv")}
              disabled={isRunning}
              style={{ 
                cursor: "pointer",
                width: "18px",
                height: "18px",
                accentColor: "var(--accent-color)"
              }}
            />
            <span style={{ 
              fontSize: 14,
              fontWeight: comparisonMode === "json-csv" ? 600 : 400,
              color: comparisonMode === "json-csv" ? "var(--toggle-selected-text)" : "var(--text-primary)"
            }}>
              JSON + CSV Comparison
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "4px",
            border: comparisonMode === "csv-csv" ? "2px solid var(--toggle-selected-border)" : "2px solid var(--toggle-border)",
            backgroundColor: comparisonMode === "csv-csv" ? "var(--toggle-selected-bg)" : "var(--toggle-bg)",
            transition: "all 0.2s ease"
          }}>
            <input
              type="radio"
              name="comparison-mode"
              value="csv-csv"
              checked={comparisonMode === "csv-csv"}
              onChange={() => onComparisonModeChange("csv-csv")}
              disabled={isRunning}
              style={{ 
                cursor: "pointer",
                width: "18px",
                height: "18px",
                accentColor: "var(--accent-color)"
              }}
            />
            <span style={{ 
              fontSize: 14,
              fontWeight: comparisonMode === "csv-csv" ? 600 : 400,
              color: comparisonMode === "csv-csv" ? "var(--toggle-selected-text)" : "var(--text-primary)"
            }}>
              CSV + CSV Comparison
            </span>
          </label>
        </div>
      </div>

      {comparisonMode === "json-csv" ? (
        <>
          <label htmlFor="json-input">
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              Paste JSON (array of objects)
            </div>
            <textarea
              id="json-input"
              value={jsonText}
              onChange={(e) => onJsonTextChange(e.target.value)}
              rows={8}
              placeholder='[{"Property":"1 Infinite Loop","Amount":"67.00","PayeeName":"Apple"}]'
              style={{
                width: "100%",
                fontFamily: "monospace",
                borderColor: jsonError ? "#c33" : undefined
              }}
              aria-label="JSON input textarea"
              aria-invalid={jsonError ? "true" : "false"}
              aria-describedby={jsonError ? "json-error" : undefined}
            />
            {jsonError && (
              <div
                id="json-error"
                role="alert"
                style={{
                  fontSize: 12,
                  color: "#c33",
                  marginTop: 4
                }}
              >
                {jsonError}
              </div>
            )}
          </label>

          <label htmlFor="csv-file-input">
            <div style={{ fontSize: 12, marginBottom: 4 }}>Upload CSV (Bills to Enter)</div>
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              onChange={(e) => onCsvFileChange(e.target.files?.[0] ?? null)}
              aria-label="CSV file upload for bills to enter"
            />
          </label>
        </>
      ) : (
        <>
          <label htmlFor="bills-csv-input">
            <div style={{ fontSize: 12, marginBottom: 4, fontWeight: "bold" }}>
              Upload CSV #1: Bills to Enter
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
        </>
      )}

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
