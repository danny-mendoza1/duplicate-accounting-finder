import { useState, useCallback } from 'react';
import { parseCsvText, createAppError } from '../helpers';
import type { AppError, ParseFilesResult } from '../types';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_DISPLAY, BILLS_CSV_COLUMNS, BUILDIUM_CSV_COLUMNS, ERROR_TYPES } from '../constants';

export function useFileProcessing() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [buildiumCsvFile, setBuildiumCsvFile] = useState<File | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<AppError | null>(null);

  const parseFiles = useCallback(async (
    billsCsvFile: File | null,
    buildiumFile: File | null
  ): Promise<ParseFilesResult | null> => {
    setIsRunning(true);
    setLoadingMessage('Starting...');
    setError(null);

    try {
      // Validate files exist
      if (!billsCsvFile || !buildiumFile) {
        setError(
          createAppError(
            ERROR_TYPES.EMPTY_INPUT,
            'Missing CSV files',
            'Both CSV files are required. Please upload both "Bills to Enter" and "Buildium Export" CSV files.',
          ),
        );
        return null;
      }

      // Validate file sizes
      if (billsCsvFile.size > MAX_FILE_SIZE_BYTES) {
        setError(
          createAppError(
            ERROR_TYPES.VALIDATION_ERROR,
            `Bills CSV file is too large (${(billsCsvFile.size / 1024 / 1024).toFixed(1)}MB)`,
            `Please upload a file smaller than ${MAX_FILE_SIZE_DISPLAY}. Consider filtering your data before export.`,
          ),
        );
        return null;
      }

      if (buildiumFile.size > MAX_FILE_SIZE_BYTES) {
        setError(
          createAppError(
            ERROR_TYPES.VALIDATION_ERROR,
            `Buildium CSV file is too large (${(buildiumFile.size / 1024 / 1024).toFixed(1)}MB)`,
            `Please upload a file smaller than ${MAX_FILE_SIZE_DISPLAY}. Consider filtering your data before export.`,
          ),
        );
        return null;
      }

      setLoadingMessage('Parsing CSV files...');

      const billsRecords = parseCsvText(await billsCsvFile.text(), BILLS_CSV_COLUMNS, 'bills');
      const buildiumRecords = parseCsvText(await buildiumFile.text(), BUILDIUM_CSV_COLUMNS, 'buildium');

      return {
        billsRecords,
        buildiumRecords,
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        let errorType = ERROR_TYPES.PARSING_ERROR as typeof ERROR_TYPES[keyof typeof ERROR_TYPES];
        let suggestion =
          'Check that your data format is correct and all required columns are present.';

        if (e.message.includes('CSV')) {
          suggestion = 'Ensure your CSV has the required columns: Property, Amount, and Vendor.';
        } else if (e.message.includes('missing required columns')) {
          errorType = ERROR_TYPES.VALIDATION_ERROR;
          suggestion =
            'Check that your file contains columns named: Property, Amount, and Vendor (case-sensitive).';
        }

        setError(createAppError(errorType, e.message, suggestion));
      } else {
        setError(
          createAppError(
            ERROR_TYPES.PARSING_ERROR,
            'An unexpected error occurred',
            'Try refreshing the page and uploading your files again. If the problem persists, check your data format.',
          ),
        );
      }
      return null;
    } finally {
      setIsRunning(false);
      setLoadingMessage('');
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    csvFile,
    setCsvFile,
    buildiumCsvFile,
    setBuildiumCsvFile,
    isRunning,
    loadingMessage,
    error,
    parseFiles,
    reset,
  };
}
