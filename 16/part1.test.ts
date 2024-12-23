import { describe, expect, test } from 'bun:test';
import { createReindeerMaze, determineLowestScore } from './part1.ts';

describe('determineLowestScore', () => {
  test('returns the lowest score for the given maze with equivalent paths', () => {
    const text = `
      ###########
      #........E#
      #.#######.#
      #S........#
      ###########
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(1010);
  });
  test('returns the lowest score for the first prompt example', () => {
    const text = `
      ###############
      #.......#....E#
      #.#.###.#.###.#
      #.....#.#...#.#
      #.###.#####.#.#
      #.#.#.......#.#
      #.#.#####.###.#
      #...........#.#
      ###.#.#####.#.#
      #...#.....#.#.#
      #.#.#.###.#.#.#
      #.....#...#.#.#
      #.###.#.#.#.#.#
      #S..#.....#...#
      ###############
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(7036);
  });
  test('returns lowest score for the second prompt example', () => {
    const text = `
      #################
      #...#...#...#..E#
      #.#.#.#.#.#.#.#.#
      #.#.#.#...#...#.#
      #.#.#.#.###.#.#.#
      #...#.#.#.....#.#
      #.#.#.#.#.#####.#
      #.#...#.#.#.....#
      #.#.#####.#.###.#
      #.#.#.......#...#
      #.#.###.#####.###
      #.#.#...#.....#.#
      #.#.#.#####.###.#
      #.#.#.........#.#
      #.#.#.#########.#
      #S#.............#
      #################
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(11048);
  });
  test('returns lowest score with 2 turns', () => {
    const text = `
      #####
      #S.#
      ##.#
      #E.#
      ####
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(2004);
  });
  test('returns lowest score with 2 opposite turns', () => {
    const text = `
      #####
      ##.E#
      ##.##
      #S.##
      #####
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(2004);
  });
  test('returns lowest score with 3 same turns', () => {
    const text = `
      #####
      #...#
      #E#.#
      ###.#
      #S..#
      #####
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(3008);
  });
  test('returns lowest score straight line score', () => {
    const text = `
      #######
      #S...E#
      #######
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(4);
  });
  test('returns lowest score lots of turns', () => {
    const text = `
      #######
      #....E#
      #.#.#.#
      #.....#
      #.#.#.#
      #.....#
      #.#.#.#
      #S....#
      #######
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(1010);
  });
  test('returns lowest score lots of turns starting with a turn', () => {
    const text = `
      #######
      #....E#
      #.#.#.#
      #.....#
      #.#.#.#
      #.....#
      #.#.#.#
      #S#...#
      #######
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(2010);
  });
  test('returns lowest score lots of turns starting with a turn, min of three turns', () => {
    const text = `
      #######
      #.#..E#
      #.#.#.#
      #.....#
      #.#.#.#
      #.....#
      #.#.#.#
      #S#...#
      #######
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(3010);
  });
  test('uses bypass shortcuts', () => {
    const text = `
      #######
      #.....#
      #.###.#
      #.....#
      #.###.#
      #.###.#
      #.###.#
      #S###E#
      #######
    `;
    const maze = createReindeerMaze(text);
    expect(determineLowestScore(maze)).toBe(3012);
  });
})
