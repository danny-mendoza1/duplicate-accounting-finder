import type { AppError } from "../types";

interface ErrorDisplayProps {
  error: AppError | null;
  droppedCount: number;
}

export default function ErrorDisplay({ error, droppedCount }: ErrorDisplayProps) {
  if (error) {
    return (
      <div 
        role="alert" 
        aria-live="polite" 
        style={{ 
          padding: 12,
          backgroundColor: "#fee",
          border: "1px solid #c33",
          borderRadius: 4,
          color: "#811",
          marginBottom: 12
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>
          {error.message}
        </div>
        {error.suggestion && (
          <div style={{ fontSize: 14, marginTop: 8 }}>
            <strong>Suggestion:</strong> {error.suggestion}
          </div>
        )}
        {error.details && (
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>
            {error.details}
          </div>
        )}
      </div>
    );
  }

  if (droppedCount > 0) {
    return (
      <div style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>
        Skipped {droppedCount} row(s) missing property or amount.
      </div>
    );
  }

  return null;
}
