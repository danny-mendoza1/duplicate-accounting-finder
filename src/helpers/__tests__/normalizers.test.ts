import { describe, it, expect } from 'vitest';
import { normalizeAmount, normalizeProperty, normalizeVendor, keyify } from '../normalizers';

describe('normalizeAmount', () => {
  it('should convert positive dollar amount to cents', () => {
    expect(normalizeAmount('123.45')).toBe(12345);
    expect(normalizeAmount('100')).toBe(10000);
    expect(normalizeAmount('0.01')).toBe(1);
  });

  it('should handle parentheses as negative', () => {
    expect(normalizeAmount('(123.45)')).toBe(-12345);
    expect(normalizeAmount('(50.00)')).toBe(-5000);
  });

  it('should handle trailing minus as negative', () => {
    expect(normalizeAmount('123.45-')).toBe(-12345);
    expect(normalizeAmount('50.00-')).toBe(-5000);
  });

  it('should remove currency symbols and commas', () => {
    expect(normalizeAmount('$1,234.56')).toBe(123456);
    expect(normalizeAmount('$10,000.00')).toBe(1000000);
    expect(normalizeAmount('1,234')).toBe(123400);
  });

  it('should handle null/empty values', () => {
    expect(normalizeAmount(null)).toBeNull();
    expect(normalizeAmount(undefined)).toBeNull();
    expect(normalizeAmount('')).toBeNull();
  });

  it('should handle invalid values', () => {
    expect(normalizeAmount('abc')).toBeNull();
    expect(normalizeAmount('$$$')).toBe(0); // After removing $, empty string converts to 0
  });

  it('should handle numeric inputs', () => {
    expect(normalizeAmount(123.45)).toBe(12345);
    expect(normalizeAmount(100)).toBe(10000);
  });

  it('should round to nearest cent', () => {
    expect(normalizeAmount('123.456')).toBe(12346);
    expect(normalizeAmount('123.454')).toBe(12345);
  });
});

describe('normalizeProperty', () => {
  it('should trim and lowercase property names', () => {
    expect(normalizeProperty('  123 Main St  ')).toBe('123 main st');
    expect(normalizeProperty('PROPERTY NAME')).toBe('property name');
  });

  it('should collapse multiple spaces', () => {
    expect(normalizeProperty('123   Main    St')).toBe('123 main st');
    expect(normalizeProperty('Property  Name')).toBe('property name');
  });

  it('should handle empty strings', () => {
    expect(normalizeProperty('')).toBe('');
    expect(normalizeProperty('   ')).toBe('');
  });
});

describe('normalizeVendor', () => {
  it('should trim and lowercase vendor names', () => {
    expect(normalizeVendor('  Acme Corp  ')).toBe('acme corp');
    expect(normalizeVendor('VENDOR NAME')).toBe('vendor name');
  });

  it('should collapse multiple spaces', () => {
    expect(normalizeVendor('Acme   Corp')).toBe('acme corp');
  });

  it('should handle empty strings', () => {
    expect(normalizeVendor('')).toBe('');
  });
});

describe('keyify', () => {
  it('should create consistent keys from vendor, property and amount', () => {
    expect(keyify({ vendorNorm: 'acme corp', property: '123 main st', amountCents: 12345 })).toBe(
      'acme corp|123 main st|12345',
    );
    expect(
      keyify({ vendorNorm: 'vendor inc', property: 'property name', amountCents: 10000 }),
    ).toBe('vendor inc|property name|10000');
  });

  it('should handle null amounts', () => {
    expect(keyify({ vendorNorm: 'acme corp', property: '123 main st', amountCents: null })).toBe(
      'acme corp|123 main st|null',
    );
  });

  it('should handle empty properties', () => {
    expect(keyify({ vendorNorm: 'acme corp', property: '', amountCents: 12345 })).toBe(
      'acme corp||12345',
    );
  });

  it('should handle empty vendor', () => {
    expect(keyify({ vendorNorm: '', property: '123 main st', amountCents: 12345 })).toBe(
      '|123 main st|12345',
    );
  });
});
