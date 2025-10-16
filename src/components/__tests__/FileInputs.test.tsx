import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileInputs } from '../FileInputs';

describe('FileInputs', () => {
  const defaultProps = {
    onCsvFileChange: vi.fn(),
    onBuildiumCsvFileChange: vi.fn(),
    isRunning: false,
    onRun: vi.fn(),
  };

  describe('CSV file inputs', () => {
    it('should render two CSV file inputs', () => {
      render(<FileInputs {...defaultProps} />);

      expect(screen.getByLabelText(/CSV file upload for bills to enter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/CSV file upload for Buildium export/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Find duplicates/i })).toBeInTheDocument();
    });

    it('should call onCsvFileChange for bills CSV', () => {
      const onCsvFileChange = vi.fn();
      render(<FileInputs {...defaultProps} onCsvFileChange={onCsvFileChange} />);

      const file = new File(['test'], 'bills.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(onCsvFileChange).toHaveBeenCalledWith(file);
    });

    it('should call onBuildiumCsvFileChange for Buildium CSV', () => {
      const onBuildiumCsvFileChange = vi.fn();
      render(<FileInputs {...defaultProps} onBuildiumCsvFileChange={onBuildiumCsvFileChange} />);

      const file = new File(['test'], 'buildium.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for Buildium export/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(onBuildiumCsvFileChange).toHaveBeenCalledWith(file);
    });
  });

  describe('Button behavior', () => {
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

    it('should display loading message when running', () => {
      render(
        <FileInputs {...defaultProps} isRunning={true} loadingMessage="Processing files..." />,
      );

      expect(screen.getByText('Processing files...')).toBeInTheDocument();
    });

    it('should not display loading message when not running', () => {
      render(
        <FileInputs {...defaultProps} isRunning={false} loadingMessage="Processing files..." />,
      );

      expect(screen.queryByText('Processing files...')).not.toBeInTheDocument();
    });
  });
});
