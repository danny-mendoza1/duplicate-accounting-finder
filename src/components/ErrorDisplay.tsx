import type { AppError } from '../types';

interface ErrorDisplayProps {
  error: AppError | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (error) {
    return (
      <div role="alert" aria-live="polite" className="error-display">
        <div className="error-display-title">{error.message}</div>
        {error.suggestion && (
          <div className="error-display-suggestion">
            <strong>Suggestion:</strong> {error.suggestion}
          </div>
        )}
        {error.details && <div className="error-display-details">{error.details}</div>}
      </div>
    );
  }

  return null;
}
