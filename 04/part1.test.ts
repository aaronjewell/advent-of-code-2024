import { describe, expect, test } from 'bun:test';
import { characterAt } from './part1.ts';

describe('characterAt', () => {
  test('returns character at position', () => {
    expect(characterAt(['abc', 'def', 'ghi'], 1, 1)).toEqual('e');
  });

  test('returns null if out of bounds', () => {
    expect(characterAt(['abc', 'def', 'ghi'], -1, 1)).toBeNull();
    expect(characterAt(['abc', 'def', 'ghi'], 1, 3)).toBeNull();
    expect(characterAt(['abc', 'def', 'ghi'], 3, 1)).toBeNull();
  })
});
