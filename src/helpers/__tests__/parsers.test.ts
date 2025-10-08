import { describe, it, expect } from 'vitest';
import { parseCsvText, parseJsonText } from '../parsers';
import type { ColumnMap } from '../../types';

const validCsvColumns: ColumnMap = {
  property: 'Property',
  amount: 'Amount',
  vendor: 'Vendor',
  date: 'Date',
  memo: 'Memo',
};

const validJsonColumns: ColumnMap = {
  property: 'Property',
  amount: 'Amount',
  vendor: 'PayeeName',
  date: 'TransactionDate',
  memo: 'Memo',
};

describe('parseCsvText', () => {
  it('should parse valid CSV with required columns', () => {
    const csv = `Property,Amount,Vendor,Date,Memo
123 Main St,100.00,Acme Corp,2024-01-01,Payment for services`;

    const result = parseCsvText(csv, validCsvColumns);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      src: 'bills',
      i: 0,
      property: '123 main st',
      amountCents: 10000,
      vendorNorm: 'acme corp',
      vendorRaw: 'Acme Corp',
      typeRaw: 'Bill',
    });
  });

  it('should throw error when required columns are missing', () => {
    const csv = `WrongColumn,AnotherWrong
123 Main St,100.00`;

    expect(() => parseCsvText(csv, validCsvColumns)).toThrow('CSV missing required columns');
  });

  it('should handle multiple rows', () => {
    const csv = `Property,Amount,Vendor,Date,Memo
123 Main St,100.00,Acme Corp,2024-01-01,Test
456 Oak Ave,200.00,Beta Inc,2024-01-02,Another`;

    const result = parseCsvText(csv, validCsvColumns);

    expect(result).toHaveLength(2);
    expect(result[0].property).toBe('123 main st');
    expect(result[1].property).toBe('456 oak ave');
  });

  it('should handle empty rows', () => {
    const csv = `Property,Amount,Vendor,Date,Memo
123 Main St,100.00,Acme Corp,2024-01-01,Test

456 Oak Ave,200.00,Beta Inc,2024-01-02,Another`;

    const result = parseCsvText(csv, validCsvColumns);

    expect(result).toHaveLength(2);
  });

  it('should normalize property names', () => {
    const csv = `Property,Amount,Vendor,Date,Memo
  123   MAIN   ST  ,100.00,Acme Corp,2024-01-01,Test`;

    const result = parseCsvText(csv, validCsvColumns);

    expect(result[0].property).toBe('123 main st');
  });

  it('should handle accounting negatives in parentheses', () => {
    const csv = `Property,Amount,Vendor,Date,Memo
123 Main St,(100.00),Acme Corp,2024-01-01,Test`;

    const result = parseCsvText(csv, validCsvColumns);

    expect(result[0].amountCents).toBe(-10000);
  });

  it('should handle BOM characters', () => {
    const csv =
      '\uFEFFProperty,Amount,Vendor,Date,Memo\n123 Main St,100.00,Acme Corp,2024-01-01,Test';

    const result = parseCsvText(csv, validCsvColumns);

    expect(result).toHaveLength(1);
  });

  it('should throw error on malformed CSV', () => {
    const csv = `Property,Amount,Vendor
123 Main St,100.00`;

    expect(() => parseCsvText(csv, validCsvColumns)).toThrow();
  });
});

describe('parseJsonText', () => {
  it('should parse valid JSON array', () => {
    const json = JSON.stringify([
      {
        Property: '123 Main St',
        Amount: '100.00',
        PayeeName: 'Acme Corp',
        TransactionDate: '2024-01-01',
        Memo: 'Test',
      },
    ]);

    const result = parseJsonText(json, validJsonColumns);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      src: 'json',
      i: 0,
      property: '123 main st',
      amountCents: 10000,
      vendorNorm: 'acme corp',
      vendorRaw: 'Acme Corp',
      typeRaw: 'Bill',
    });
  });

  it('should throw error when JSON is not an array', () => {
    const json = JSON.stringify({ Property: '123 Main St', Amount: '100.00' });

    expect(() => parseJsonText(json, validJsonColumns)).toThrow('Expected an array of objects');
  });

  it('should throw error when required columns are missing', () => {
    const json = JSON.stringify([
      {
        WrongColumn: '123 Main St',
        AnotherWrong: '100.00',
      },
    ]);

    expect(() => parseJsonText(json, validJsonColumns)).toThrow('JSON missing required columns');
  });

  it('should handle multiple objects', () => {
    const json = JSON.stringify([
      { Property: '123 Main St', Amount: '100.00', PayeeName: 'Acme Corp' },
      { Property: '456 Oak Ave', Amount: '200.00', PayeeName: 'Beta Inc' },
    ]);

    const result = parseJsonText(json, validJsonColumns);

    expect(result).toHaveLength(2);
    expect(result[0].property).toBe('123 main st');
    expect(result[1].property).toBe('456 oak ave');
  });

  it('should handle empty array', () => {
    const json = JSON.stringify([]);

    const result = parseJsonText(json, validJsonColumns);

    expect(result).toHaveLength(0);
  });

  it('should throw error on invalid JSON', () => {
    const json = '{ invalid json }';

    expect(() => parseJsonText(json, validJsonColumns)).toThrow();
  });

  it('should normalize vendor names', () => {
    const json = JSON.stringify([
      { Property: '123 Main St', Amount: '100.00', PayeeName: '  ACME   CORP  ' },
    ]);

    const result = parseJsonText(json, validJsonColumns);

    expect(result[0].vendorNorm).toBe('acme corp');
    expect(result[0].vendorRaw).toBe('  ACME   CORP  ');
  });
});
