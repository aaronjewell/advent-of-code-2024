import { describe, test, expect } from 'bun:test';
import { isSafeReport } from './part2.ts';

describe('isSafeReport', () => {
  test('it can remove a bad level from the front', () => {
    expect(isSafeReport([3, 2, 3, 4])).toEqual(true);
  })
  test('it can remove a bad level from the end', () => {
    expect(isSafeReport([2, 3, 4, 3])).toEqual(true);
  })
  test('it can remove a bad level with just two values', () => {
    expect(isSafeReport([2, 7])).toEqual(true);
  })
  test('it does not remove two bad levels', () => {
    expect(isSafeReport([3, 2, 3, 4, 3])).toEqual(false);
  })
});
