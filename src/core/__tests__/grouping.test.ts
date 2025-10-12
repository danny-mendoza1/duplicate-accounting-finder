import { describe, it, expect } from 'vitest';
import { buildGroups } from '../grouping';
import type { CsvRecord, JsonRecord } from '../../types';

describe('buildGroups', () => {
  it('should group records with matching property and amount', () => {
    const csvRecords: CsvRecord[] = [
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

    const jsonRecords: JsonRecord[] = [
      {
        src: 'json',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const groups = buildGroups(jsonRecords, csvRecords);

    expect(groups).toHaveLength(1);
    expect(groups[0].csvRows).toHaveLength(1);
    expect(groups[0].jsonRows).toHaveLength(1);
    expect(groups[0].key).toBe('acme corp|123 main st|10000');
  });

  it('should handle multiple matches for the same key', () => {
    const csvRecords: CsvRecord[] = [
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

    const jsonRecords: JsonRecord[] = [
      {
        src: 'json',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const groups = buildGroups(jsonRecords, csvRecords);

    expect(groups).toHaveLength(1);
    expect(groups[0].csvRows).toHaveLength(2);
    expect(groups[0].jsonRows).toHaveLength(1);
  });

  it('should not group records with different properties', () => {
    const csvRecords: CsvRecord[] = [
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

    const jsonRecords: JsonRecord[] = [
      {
        src: 'json',
        i: 0,
        property: '456 oak ave',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const groups = buildGroups(jsonRecords, csvRecords);

    expect(groups).toHaveLength(0);
  });

  it('should not group records with different amounts', () => {
    const csvRecords: CsvRecord[] = [
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

    const jsonRecords: JsonRecord[] = [
      {
        src: 'json',
        i: 0,
        property: '123 main st',
        amountCents: 20000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const groups = buildGroups(jsonRecords, csvRecords);

    expect(groups).toHaveLength(0);
  });

  it('should skip records with null amounts', () => {
    const csvRecords: CsvRecord[] = [
      {
        src: 'bills',
        i: 0,
        property: '123 main st',
        amountCents: null,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const jsonRecords: JsonRecord[] = [
      {
        src: 'json',
        i: 0,
        property: '123 main st',
        amountCents: null,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const groups = buildGroups(jsonRecords, csvRecords);

    expect(groups).toHaveLength(0);
  });

  it('should skip records with empty properties', () => {
    const csvRecords: CsvRecord[] = [
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
    ];

    const jsonRecords: JsonRecord[] = [
      {
        src: 'json',
        i: 0,
        property: '',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const groups = buildGroups(jsonRecords, csvRecords);

    expect(groups).toHaveLength(0);
  });

  it('should handle empty inputs', () => {
    const groups = buildGroups([], []);
    expect(groups).toHaveLength(0);
  });

  it('should create multiple groups for different keys', () => {
    const csvRecords: CsvRecord[] = [
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
        property: '456 oak ave',
        amountCents: 20000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const jsonRecords: JsonRecord[] = [
      {
        src: 'json',
        i: 0,
        property: '123 main st',
        amountCents: 10000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
      {
        src: 'json',
        i: 1,
        property: '456 oak ave',
        amountCents: 20000,
        vendorNorm: 'acme corp',
        vendorRaw: 'Acme Corp',
        typeRaw: 'Bill',
        raw: {},
      },
    ];

    const groups = buildGroups(jsonRecords, csvRecords);

    expect(groups).toHaveLength(2);
    expect(groups[0].key).toBe('acme corp|123 main st|10000');
    expect(groups[1].key).toBe('acme corp|456 oak ave|20000');
  });
});
