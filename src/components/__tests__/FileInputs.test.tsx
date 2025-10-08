import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FileInputs from '../FileInputs';
import type { ComparisonMode } from '../../types';

describe('FileInputs', () => {
  const defaultProps = {
    jsonText: '',
    onJsonTextChange: vi.fn(),
    onCsvFileChange: vi.fn(),
    onBuildiumCsvFileChange: vi.fn(),
    isRunning: false,
    onRun: vi.fn(),
    comparisonMode: 'json-csv' as ComparisonMode,
    onComparisonModeChange: vi.fn(),
  };

  describe('JSON+CSV mode', () => {
    it('should render JSON textarea and CSV file input', () => {
      render(<FileInputs {...defaultProps} comparisonMode="json-csv" />);

      expect(screen.getByLabelText(/JSON input textarea/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/CSV file upload for bills to enter/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Find duplicates/i })).toBeInTheDocument();
    });

    it('should call onJsonTextChange when textarea changes', () => {
      const onJsonTextChange = vi.fn();
      render(<FileInputs {...defaultProps} comparisonMode="json-csv" onJsonTextChange={onJsonTextChange} />);

      const textarea = screen.getByLabelText(/JSON input textarea/i);
      fireEvent.change(textarea, { target: { value: '{"test": "data"}' } });

      expect(onJsonTextChange).toHaveBeenCalledWith('{"test": "data"}');
    });

    it('should call onCsvFileChange when file is selected', () => {
      const onCsvFileChange = vi.fn();
      render(<FileInputs {...defaultProps} comparisonMode="json-csv" onCsvFileChange={onCsvFileChange} />);

      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(onCsvFileChange).toHaveBeenCalledWith(file);
    });

    it('should display current JSON text value', () => {
      render(<FileInputs {...defaultProps} comparisonMode="json-csv" jsonText='[{"test": "value"}]' />);

      const textarea = screen.getByLabelText(/JSON input textarea/i) as HTMLTextAreaElement;
      expect(textarea.value).toBe('[{"test": "value"}]');
    });
  });

  describe('CSV+CSV mode', () => {
    it('should render two CSV file inputs', () => {
      render(<FileInputs {...defaultProps} comparisonMode="csv-csv" />);

      expect(screen.getByLabelText(/CSV file upload for bills to enter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/CSV file upload for Buildium export/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/JSON input textarea/i)).not.toBeInTheDocument();
    });

    it('should call onCsvFileChange for bills CSV', () => {
      const onCsvFileChange = vi.fn();
      render(<FileInputs {...defaultProps} comparisonMode="csv-csv" onCsvFileChange={onCsvFileChange} />);

      const file = new File(['test'], 'bills.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(onCsvFileChange).toHaveBeenCalledWith(file);
    });

    it('should call onBuildiumCsvFileChange for Buildium CSV', () => {
      const onBuildiumCsvFileChange = vi.fn();
      render(<FileInputs {...defaultProps} comparisonMode="csv-csv" onBuildiumCsvFileChange={onBuildiumCsvFileChange} />);

      const file = new File(['test'], 'buildium.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for Buildium export/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(onBuildiumCsvFileChange).toHaveBeenCalledWith(file);
    });
  });

  describe('Common behavior', () => {
    it('should call onRun when button is clicked', () => {
      const onRun = vi.fn();
      render(<FileInputs {...defaultProps} onRun={onRun} />);

      const button = screen.getByRole('button', { name: /Find duplicates/i });
      fireEvent.click(button);

      expect(onRun).toHaveBeenCalledTimes(1);
    });

    it('should disable button when running', () => {
      render(<FileInputs {...defaultProps} isRunning={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Running…');
    });

    it('should show "Find duplicates" when not running', () => {
      render(<FileInputs {...defaultProps} isRunning={false} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('Find duplicates');
    });

    it('should render comparison mode toggle', () => {
      render(<FileInputs {...defaultProps} />);

      expect(screen.getByText(/Comparison Mode/i)).toBeInTheDocument();
      expect(screen.getByText(/JSON \+ CSV Comparison/i)).toBeInTheDocument();
      expect(screen.getByText(/CSV \+ CSV Comparison/i)).toBeInTheDocument();
    });

    it('should call onComparisonModeChange when mode changes', () => {
      const onComparisonModeChange = vi.fn();
      render(<FileInputs {...defaultProps} comparisonMode="json-csv" onComparisonModeChange={onComparisonModeChange} />);

      const csvCsvRadio = screen.getByLabelText(/CSV \+ CSV Comparison/i);
      fireEvent.click(csvCsvRadio);

      expect(onComparisonModeChange).toHaveBeenCalledWith('csv-csv');
    });
  });
});
