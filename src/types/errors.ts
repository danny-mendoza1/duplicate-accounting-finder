// Error type constants (runtime values)
export const ERROR_TYPES = {
  PARSING_ERROR: 'PARSING_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMPTY_INPUT: 'EMPTY_INPUT',
  VENDOR_SCOPE_ERROR: 'VENDOR_SCOPE_ERROR',
  NO_MATCHES: 'NO_MATCHES',
} as const;

// Error type (TypeScript type derived from the constants)
export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

// Error data structure
export interface AppError {
  type: ErrorType;
  message: string;
  suggestion?: string;
  details?: string;
}
