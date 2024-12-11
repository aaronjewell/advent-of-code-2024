import { describe, expect, test } from 'bun:test';
import { getTotalCalibrationResult, isValidTestValue } from './part1.ts';

describe('isValidTestValue', () => {
  test('valid for all addition test value', () => {
    expect(isValidTestValue(6, 0, [1, 2, 3])).toBe(true);
    expect(isValidTestValue(4, 0, [1, 1, 1, 1])).toBe(true);
  })

  test('valid for all multiplication test value', () => {
    expect(isValidTestValue(125, 0, [5, 5, 5])).toBe(true);
    expect(isValidTestValue(1, 0, [1, 1, 1])).toBe(true);
    expect(isValidTestValue(190, 0, [19, 10])).toBe(true);
  });

  test('valid for mixed test value', () => {
    expect(isValidTestValue(4, 0, [2, 2])).toBe(true);
    expect(isValidTestValue(3267, 0, [27, 40, 81])).toBe(true);
  })

  test('invalid for operands that cannot equal result', () => {
    expect(isValidTestValue(83, 0, [5, 17])).toBe(false);
    expect(isValidTestValue(156, 0, [15, 6])).toBe(false);
    expect(isValidTestValue(156, 0, [6, 15])).toBe(false);
    expect(isValidTestValue(7290, 0, [15, 6, 8, 6])).toBe(false);
  })
})

describe('getTotalCalibrationResult', () => {
  test('returns the sum of all valid test values', () => {
    expect(getTotalCalibrationResult([
      {
        operands: [19, 10],
        testValue: 190,
      }, {
        operands: [27, 40, 81],
        testValue: 3267,
      }, {
        operands: [5, 17],
        testValue: 83,
      }, {
        operands: [6, 15],
        testValue: 156,
      }, {
        operands: [15, 6, 8, 6],
        testValue: 7290,
      }, {
        operands: [13, 10, 16],
        testValue: 161011,
      }, {
        operands: [14, 8, 17],
        testValue: 192,
      }, {
        operands: [13, 18, 7, 9],
        testValue: 21037,
      }, {
        operands: [20, 16, 6, 11],
        testValue: 292,
      }
    ])).toEqual(3749)
  })
})
