import type { ERROR_TYPES } from '../constants';

// Error type (TypeScript type derived from the constants)
export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

// Error data structure
export interface AppError {
  type: ErrorType;
  message: string;
  suggestion?: string;
  details?: string;
}
