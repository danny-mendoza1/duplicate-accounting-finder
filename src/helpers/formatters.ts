import { normalizeAmount } from "./normalizers";
import type { AppError } from "../types";

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export function formatUSDFromCents(cents: number): string {
  return cents == null ? '' : USD.format(cents / 100);
}

export function formatUSD(value: string): string {
  const cents = normalizeAmount(value);
  return cents == null ? String(value ?? '') : USD.format(Number(cents) / 100);
}

export function formatErrorMessage(error: AppError): string {
  let msg = error.message;
  if (error.suggestion) {
    msg += `\n\nSuggestion: ${error.suggestion}`;
  }
  if (error.details) {
    msg += `\n\nDetails: ${error.details}`;
  }
  return msg;
}
