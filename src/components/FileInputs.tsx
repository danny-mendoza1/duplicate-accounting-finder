import { useState, useEffect } from "react";

interface FileInputsProps {
  jsonText: string;
  onJsonTextChange: (text: string) => void;
  onCsvFileChange: (file: File | null) => void;
  isRunning: boolean;
  loadingMessage?: string;
  onRun: () => void;
}

export default function FileInputs({
  jsonText,
  onJsonTextChange,
  onCsvFileChange,
  isRunning,
  loadingMessage,
  onRun
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
      <label htmlFor="json-input">
        <div style={{ fontSize: 12, marginBottom: 4 }}>
          Paste JSON (array of objects)
        </div>
        <textarea
          id="json-input"
          value={jsonText}
          onChange={(e) => onJsonTextChange(e.target.value)}
          rows={8}
          placeholder='[{"Property":"731 W. Barry Ave.","Amount":"165.00","PayeeName":"A Appliance Source Inc"}]'
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
        <div style={{ fontSize: 12, marginBottom: 4 }}>Upload CSV</div>
        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          onChange={(e) => onCsvFileChange(e.target.files?.[0] ?? null)}
          aria-label="CSV file upload"
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
