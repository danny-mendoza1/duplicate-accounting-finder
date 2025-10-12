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
  // Try to find #RRGGBB format (6 digits)
  const sixDigit = String(memo ?? '').match(/#([0-9A-Fa-f]{6})(?![0-9A-Fa-f])/);
  if (sixDigit) return `#${sixDigit[1]}`;
  
  // Try to find #RGB shorthand (3 digits) and expand it
  const threeDigit = String(memo ?? '').match(/#([0-9A-Fa-f]{3})(?![0-9A-Fa-f])/);
  if (threeDigit) {
    const [r, g, b] = threeDigit[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  
  return null;
}

export function extractMemoNumber(memo: string): string | null {
  const match = String(memo ?? '').match(/^\s*(\d+)/);
  return match ? match[1] : null;
}

export function generateColorFromNumber(num: string): string {
  const hash = parseInt(num, 10);
  // Convert to hue (0-360 degrees) for consistent color distribution
  const hue = hash % 360;
  // Use HSL for vibrant but readable colors
  return `hsl(${hue}, 65%, 55%)`;
}

export function getMemoColor(memo: string): { color: string; source: 'hex' | 'number' | 'default' } {
  // Priority 1: Hex color in memo
  const hex = findHexInMemo(memo);
  if (hex) return { color: hex, source: 'hex' };
  
  // Priority 2: Generate from memo number
  const number = extractMemoNumber(memo);
  if (number) return { color: generateColorFromNumber(number), source: 'number' };
  
  // Priority 3: Default neutral color
  return { color: '#999999', source: 'default' };
}

export function createAppError(
  type: ErrorType,
  message: string,
  suggestion?: string,
  details?: string,
): AppError {
  return { type, message, suggestion, details };
}
