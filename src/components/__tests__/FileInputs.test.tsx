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

  describe('File status display', () => {
    it('should show "No file selected" when no file is uploaded', () => {
      render(<FileInputs {...defaultProps} />);

      const statusElements = screen.getAllByText(/No file selected/i);
      expect(statusElements).toHaveLength(2); // One for each input
    });

    it('should display filename when bills file is uploaded', () => {
      render(<FileInputs {...defaultProps} />);

      const file = new File(['test'], 'vendor-invoice-2024.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(screen.getByText(/vendor-invoice-2024.csv/)).toBeInTheDocument();
    });

    it('should display filename when Buildium file is uploaded', () => {
      render(<FileInputs {...defaultProps} />);

      const file = new File(['test'], 'buildium-export.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for Buildium export/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(screen.getByText(/buildium-export.csv/)).toBeInTheDocument();
    });

    it('should show checkmark icon when file is uploaded', () => {
      render(<FileInputs {...defaultProps} />);

      const file = new File(['test'], 'bills.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(screen.getByLabelText('File uploaded')).toBeInTheDocument();
    });

    it('should truncate long filenames', () => {
      render(<FileInputs {...defaultProps} />);

      const longFilename = 'very_long_vendor_invoice_report_2024_q4_final_version_2.csv';
      const file = new File(['test'], longFilename, { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      // Should show truncated version with ellipsis
      const filenameElement = screen.getByTitle(longFilename); // Full name in tooltip
      expect(filenameElement.textContent?.length).toBeLessThan(longFilename.length);
      expect(filenameElement.textContent).toContain('...');
    });

    it('should display full filename in tooltip', () => {
      render(<FileInputs {...defaultProps} />);

      const filename = 'my-vendor-invoice.csv';
      const file = new File(['test'], filename, { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      const filenameElement = screen.getByTitle(filename);
      expect(filenameElement).toBeInTheDocument();
    });
  });

  describe('Remove button functionality', () => {
    it('should show remove button when file is uploaded', () => {
      render(<FileInputs {...defaultProps} />);

      const file = new File(['test'], 'bills.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      const removeButtons = screen.getAllByLabelText('Remove file');
      expect(removeButtons.length).toBeGreaterThan(0);
    });

    it('should clear bills file when remove button is clicked', () => {
      const onCsvFileChange = vi.fn();
      render(<FileInputs {...defaultProps} onCsvFileChange={onCsvFileChange} />);

      // Upload file
      const file = new File(['test'], 'bills.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for bills to enter/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(screen.getByText('bills.csv')).toBeInTheDocument();

      // Click remove button
      const removeButtons = screen.getAllByLabelText('Remove file');
      fireEvent.click(removeButtons[0]);

      // Should call with null and show empty state
      expect(onCsvFileChange).toHaveBeenCalledWith(null);
      expect(screen.queryByText('bills.csv')).not.toBeInTheDocument();
    });

    it('should clear Buildium file when remove button is clicked', () => {
      const onBuildiumCsvFileChange = vi.fn();
      render(<FileInputs {...defaultProps} onBuildiumCsvFileChange={onBuildiumCsvFileChange} />);

      // Upload file
      const file = new File(['test'], 'buildium.csv', { type: 'text/csv' });
      const input = screen.getByLabelText(/CSV file upload for Buildium export/i);
      fireEvent.change(input, { target: { files: [file] } });

      expect(screen.getByText('buildium.csv')).toBeInTheDocument();

      // Click remove button
      const removeButtons = screen.getAllByLabelText('Remove file');
      fireEvent.click(removeButtons[0]);

      // Should call with null
      expect(onBuildiumCsvFileChange).toHaveBeenCalledWith(null);
      expect(screen.queryByText('buildium.csv')).not.toBeInTheDocument();
    });

    it('should clear both files independently', () => {
      const onCsvFileChange = vi.fn();
      const onBuildiumCsvFileChange = vi.fn();
      render(
        <FileInputs
          {...defaultProps}
          onCsvFileChange={onCsvFileChange}
          onBuildiumCsvFileChange={onBuildiumCsvFileChange}
        />,
      );

      // Upload both files
      const billsFile = new File(['test'], 'bills.csv', { type: 'text/csv' });
      const buildiumFile = new File(['test'], 'buildium.csv', { type: 'text/csv' });

      const billsInput = screen.getByLabelText(/CSV file upload for bills to enter/i);
      const buildiumInput = screen.getByLabelText(/CSV file upload for Buildium export/i);

      fireEvent.change(billsInput, { target: { files: [billsFile] } });
      fireEvent.change(buildiumInput, { target: { files: [buildiumFile] } });

      expect(screen.getByText('bills.csv')).toBeInTheDocument();
      expect(screen.getByText('buildium.csv')).toBeInTheDocument();

      // Remove only bills file
      const removeButtons = screen.getAllByLabelText('Remove file');
      fireEvent.click(removeButtons[0]); // First remove button (bills)

      // Bills should be cleared, buildium should remain
      expect(onCsvFileChange).toHaveBeenCalledWith(null);
      expect(screen.queryByText('bills.csv')).not.toBeInTheDocument();
      expect(screen.getByText('buildium.csv')).toBeInTheDocument();
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
