import { describe, expect, test } from 'bun:test';
import { splitNumberInTwoParts, hasEvenDigits } from './part1.ts';

describe('splitNumberInTwoParts', () => {
  test('splits a number into two parts', () => {
    expect(splitNumberInTwoParts(2525)).toEqual([25, 25]);
    expect(splitNumberInTwoParts(123456)).toEqual([123, 456]);
    expect(splitNumberInTwoParts(5)).toEqual([5, 0]);
  });
})

describe('hasEvenDigits', () => {
  test('returns true if a number has even digits', () => {
    expect(hasEvenDigits(2525)).toBe(true);
    expect(hasEvenDigits(123456)).toBe(true);
    expect(hasEvenDigits(5)).toBe(false);
    expect(hasEvenDigits(567)).toBe(false);
  });
});
