import { describe, expect, test } from 'bun:test';
import { countOutsideCorners, countInsideCorners, vectorToBitmask } from './part2.ts';

describe('countOutsideCorners', () => {
  test('counts all corners', () => {
    expect(countOutsideCorners(0b1111)).toBe(4);
  });
  test('counts top left and top right corners', () => {
    expect(countOutsideCorners(0b1101)).toBe(2);
  })
  test('counts top right and bottom right corners', () => {
    expect(countOutsideCorners(0b1110)).toBe(2);
  })
  test('counts bottom right and bottom left corners', () => {
    expect(countOutsideCorners(0b0111)).toBe(2);
  })
  test('counts bottom left and top left corners', () => {
    expect(countOutsideCorners(0b1011)).toBe(2);
  })
  test('counts top right corner', () => {
    expect(countOutsideCorners(0b1100)).toBe(1);
  })
  test('counts bottom right corner', () => {
    expect(countOutsideCorners(0b0110)).toBe(1);
  })
  test('counts bottom left corner', () => {
    expect(countOutsideCorners(0b0011)).toBe(1);
  })
  test('counts top left corner', () => {
    expect(countOutsideCorners(0b1001)).toBe(1);
  })
})

describe('countInsideCorners', () => {
  test('counts all corners', () => {
    expect(countInsideCorners(0b10101010)).toBe(4);
  });
  test('counts top right corner', () => {
    expect(countInsideCorners(0b10100000)).toBe(1);
  });
  test('counts bottom right corner', () => {
    expect(countInsideCorners(0b00101000)).toBe(1);
  });
  test('counts bottom left corner', () => {
    expect(countInsideCorners(0b00001010)).toBe(1);
  });
  test('counts top left corner', () => {
    expect(countInsideCorners(0b10000010)).toBe(1);
  });
});

describe('vectorToBitmask', () => {
  test('converts vector to bitmask', () => {
    expect(vectorToBitmask(-1, 0)).toBe(0b1000);
    expect(vectorToBitmask(0, 1)).toBe(0b0100);
    expect(vectorToBitmask(1, 0)).toBe(0b0010);
    expect(vectorToBitmask(0, -1)).toBe(0b0001);
  })
})
