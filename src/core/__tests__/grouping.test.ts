import { describe, it, expect } from 'vitest';
import { buildGroupsCsvToCsv } from '../grouping';
import type { CsvRecord } from '../../types';

describe('buildGroupsCsvToCsv', () => {
  it('should group bills records with matching buildium records', () => {
    const billsRecords: CsvRecord[] = [
      {
        src: 'bills',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const buildiumRecords: CsvRecord[] = [
      {
        src: 'buildium',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const { validGroups, invalidBills } = buildGroupsCsvToCsv(billsRecords, buildiumRecords);

    expect(validGroups).toHaveLength(1);
    expect(validGroups[0].billsRows).toHaveLength(1);
    expect(validGroups[0].buildiumRows).toHaveLength(1);
    expect(validGroups[0].key).toBe('acme corp|123 main st|10000');
    expect(invalidBills).toHaveLength(0);
  });

  it('should separate invalid bills', () => {
    const billsRecords: CsvRecord[] = [
      {
        src: 'bills',
        i: 0,
        property: '',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
      {
        src: 'bills',
        i: 1,
        property: '123 main st',
        amountCents: null,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const buildiumRecords: CsvRecord[] = [];

    const { validGroups, invalidBills } = buildGroupsCsvToCsv(billsRecords, buildiumRecords);

    expect(validGroups).toHaveLength(0);
    expect(invalidBills).toHaveLength(2);
  });

  it('should not group records with different properties', () => {
    const billsRecords: CsvRecord[] = [
      {
        src: 'bills',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const buildiumRecords: CsvRecord[] = [
      {
        src: 'buildium',
        i: 0,
        property: '456 oak ave',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const { validGroups } = buildGroupsCsvToCsv(billsRecords, buildiumRecords);

    expect(validGroups).toHaveLength(0);
  });

  it('should not group records with different amounts', () => {
    const billsRecords: CsvRecord[] = [
      {
        src: 'bills',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const buildiumRecords: CsvRecord[] = [
      {
        src: 'buildium',
        i: 0,
        property: '123 main st',
        amountCents: 20000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const { validGroups } = buildGroupsCsvToCsv(billsRecords, buildiumRecords);

    expect(validGroups).toHaveLength(0);
  });

  it('should handle empty inputs', () => {
    const { validGroups, invalidBills } = buildGroupsCsvToCsv([], []);
    expect(validGroups).toHaveLength(0);
    expect(invalidBills).toHaveLength(0);
  });

  it('should handle multiple matches for the same key', () => {
    const billsRecords: CsvRecord[] = [
      {
        src: 'bills',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
      {
        src: 'bills',
        i: 1,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const buildiumRecords: CsvRecord[] = [
      {
        src: 'buildium',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const { validGroups } = buildGroupsCsvToCsv(billsRecords, buildiumRecords);

    expect(validGroups).toHaveLength(1);
    expect(validGroups[0].billsRows).toHaveLength(2);
    expect(validGroups[0].buildiumRows).toHaveLength(1);
  });

  it('should use absolute values for amount matching', () => {
    const billsRecords: CsvRecord[] = [
      {
        src: 'bills',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const buildiumRecords: CsvRecord[] = [
      {
        src: 'buildium',
        i: 0,
        property: '123 main st',
        amountCents: -10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Payment',
        raw: {},
      },
    ];

    const { validGroups } = buildGroupsCsvToCsv(billsRecords, buildiumRecords);

    expect(validGroups).toHaveLength(1);
    expect(validGroups[0].billsRows[0].amountCents).toBe(10000);
    expect(validGroups[0].buildiumRows[0].amountCents).toBe(-10000);
  });
});
