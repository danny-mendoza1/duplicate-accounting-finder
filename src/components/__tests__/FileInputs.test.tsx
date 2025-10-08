import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FileInputs from '../FileInputs';

describe('FileInputs', () => {
  const defaultProps = {
    jsonText: '',
    onJsonTextChange: vi.fn(),
    onCsvFileChange: vi.fn(),
    isRunning: false,
    onRun: vi.fn(),
  };

  it('should render all input fields', () => {
    render(<FileInputs {...defaultProps} />);
    
    expect(screen.getByLabelText(/JSON input textarea/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CSV file upload/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Find duplicates/i })).toBeInTheDocument();
  });

  it('should call onJsonTextChange when textarea changes', () => {
    const onJsonTextChange = vi.fn();
    render(<FileInputs {...defaultProps} onJsonTextChange={onJsonTextChange} />);
    
    const textarea = screen.getByLabelText(/JSON input textarea/i);
    fireEvent.change(textarea, { target: { value: '{"test": "data"}' } });
    
    expect(onJsonTextChange).toHaveBeenCalledWith('{"test": "data"}');
  });

  it('should call onCsvFileChange when file is selected', () => {
    const onCsvFileChange = vi.fn();
    render(<FileInputs {...defaultProps} onCsvFileChange={onCsvFileChange} />);
    
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/CSV file upload/i);
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(onCsvFileChange).toHaveBeenCalledWith(file);
  });

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

  it('should display placeholder text in textarea', () => {
    render(<FileInputs {...defaultProps} />);
    
    const textarea = screen.getByLabelText(/JSON input textarea/i);
    expect(textarea).toHaveAttribute('placeholder');
  });

  it('should accept only CSV files', () => {
    render(<FileInputs {...defaultProps} />);
    
    const input = screen.getByLabelText(/CSV file upload/i);
    expect(input).toHaveAttribute('accept', '.csv');
  });

  it('should display current JSON text value', () => {
    render(<FileInputs {...defaultProps} jsonText='[{"test": "value"}]' />);
    
    const textarea = screen.getByLabelText(/JSON input textarea/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('[{"test": "value"}]');
  });
});
