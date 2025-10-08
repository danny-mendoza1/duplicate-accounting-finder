import type { AppError, ErrorType } from '../types';

export function getRaw(obj: unknown, key?: string): string {
  if (!key) return '';
  if (obj && typeof obj === 'object' && key in obj) {
    const value = (obj as Record<string, unknown>)[key];
    return String(value ?? '');
  }
  return '';
}

export function findHexInMemo(memo: string): string | null {
  const m = String(memo ?? '').match(/#([0-9A-Fa-f]{6})\b/);
  return m ? `#${m[1]}` : null;
}

export function createAppError(
  type: ErrorType,
  message: string,
  suggestion?: string,
  details?: string,
): AppError {
  return { type, message, suggestion, details };
}
