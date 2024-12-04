import { describe, expect, test } from 'bun:test';
import { findInstructions } from './part1.ts';

describe('findInstructions', () => {
  test('finds multiple instructions', () => {
    expect(findInstructions('mul(1,2)mul(2,3)')).toEqual([['mul', 1, 2], ['mul', 2, 3]]);
  });
  test('ignores bad instructions', () => {
    expect(findInstructions('mul(4*, mul(6,9!, ?(12,34)')).toEqual([]);
  });
  test('does not allow whitespace in instruction', () => {
    expect(findInstructions('mul ( 2 , 4 )')).toEqual([]);
  })
})
