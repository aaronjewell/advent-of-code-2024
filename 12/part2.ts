import { pathToFileURL } from 'url';

async function getGardenMap(): Promise<string[][]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  return (await file.text())
    .trim()
    .split('\n')
    .map(line => line.split(''));
}

function inBounds(garden: string[][], row: number, col: number): boolean {
  return row >= 0 && row < garden.length && col >= 0 && col < garden[row].length;
}

function* directions(): Generator<[number, number]> {
  yield [0, 1];
  yield [1, 0];
  yield [0, -1];
  yield [-1, 0];
}

function* allDirections(): Generator<[number, number]> {
  yield* directions()
  yield [1, 1];
  yield [1, -1];
  yield [-1, 1];
  yield [-1, -1];
}

function isSameType(garden: string[][], plantType: string, row: number, col: number): boolean {
  return inBounds(garden, row, col)
    && (garden[row][col] === plantType
      || garden[row][col] === plantType.toLowerCase()
      || garden[row][col].toLowerCase() === plantType);
}

function markVisited(garden: string[][], row: number, col: number): void {
  garden[row][col] = garden[row][col].toLowerCase();
}

function isVisited(garden: string[][], row: number, col: number): boolean {
  return garden[row][col] >= "a";
}

export function vectorToNibbleBitmask(dr: number, dc: number): number {
  if (dr === -1 && dc === 0) {
    return 0b1000;
  }
  if (dr === 0 && dc === 1) {
    return 0b0100;
  }
  if (dr === 1 && dc === 0) {
    return 0b0010;
  }
  if (dr === 0 && dc === -1) {
    return 0b0001;
  }

  throw new Error(`Invalid vector: ${dr}, ${dc}`);
}

function vectorToByteBitmask(dr: number, dc: number): number {
  if (dr === -1 && dc === 0) {
    return 0b10000000;
  } else if (dr === -1 && dc === 1) {
    return 0b01000000;
  }
  if (dr === 0 && dc === 1) {
    return 0b00100000;
  }
  if (dr === 1 && dc === 1) {
    return 0b00010000;
  }
  if (dr === 1 && dc === 0) {
    return 0b00001000;
  }
  if (dr === 1 && dc === -1) {
    return 0b00000100;
  }
  if (dr === 0 && dc === -1) {
    return 0b00000010;
  }
  if (dr === -1 && dc === -1) {
    return 0b00000001;
  }

  throw new Error(`Invalid vector: ${dr}, ${dc}`);
}

function countDifferentNeighbors(garden: string[][], row: number, col: number): number {
  let differentNeighborBitmask = 0;
  for (const [dr, dc] of directions()) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (!isSameType(garden, garden[row][col], newRow, newCol)) {
      differentNeighborBitmask |= vectorToNibbleBitmask(dr, dc);
    }
  }
  return differentNeighborBitmask;
}

function countSameNeighbors(garden: string[][], row: number, col: number): number {
  let sameNeighborBitmask = 0;
  for (const [dr, dc] of allDirections()) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isSameType(garden, garden[row][col], newRow, newCol)) {
      sameNeighborBitmask |= vectorToByteBitmask(dr, dc);
    }
  }
  return sameNeighborBitmask;
}

export function countOutsideCorners(differentNeighborBitmask: number): number {
  const N = 0b1000;
  const E = 0b0100;
  const S = 0b0010;
  const W = 0b0001;

  const adjacentSidePairs = [
    [N, E],
    [E, S],
    [S, W],
    [W, N],
  ]

  let corners = 0;

  for (const [s1, s2] of adjacentSidePairs) {
    if ((differentNeighborBitmask & s1) && (differentNeighborBitmask & s2)) {
      corners++;
    }
  }

  return corners;
}

export function countInsideCorners(sameNeighborBitmask: number): number {
  const N = 0b10000000;
  const NE = 0b01000000;
  const E = 0b00100000;
  const SE = 0b00010000;
  const S = 0b00001000;
  const SW = 0b00000100;
  const W = 0b00000010;
  const NW = 0b00000001;

  const pairsWithDiagonals = [
    [N, NE, E],
    [E, SE, S],
    [S, SW, W],
    [W, NW, N],
  ]

  let insideCorners = 0;

  for (const [s1, diagonal, s2] of pairsWithDiagonals) {
    if ((sameNeighborBitmask & s1) && !(sameNeighborBitmask & diagonal) && (sameNeighborBitmask & s2)) {
      insideCorners++;
    }
  }

  return insideCorners;
}

function getRegionPrice(garden: string[][], row: number, col: number): number {
  let area = 0;
  let corners = 0;

  let queue = [[row, col]];

  while (queue.length) {
    let n = queue.length;

    for (let i = 0; i < n; i++) {
      const [row, col] = queue.shift()!;
      if (!inBounds(garden, row, col) || isVisited(garden, row, col)) {
        continue;
      }

      corners += countOutsideCorners(countDifferentNeighbors(garden, row, col))
      corners += countInsideCorners(countSameNeighbors(garden, row, col))
      area++;

      markVisited(garden, row, col);

      for (const [dr, dc] of directions()) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isSameType(garden, garden[row][col], newRow, newCol)) {
          queue.push([newRow, newCol]);
        }
      }
    }
  }

  let sides = corners;

  return area * sides;
}

function getFencingPriceOfRegions(garden: string[][]): number {
  let sum = 0;

  for (let row = 0; row < garden.length; row++) {
    for (let col = 0; col < garden[row].length; col++) {
      if (isVisited(garden, row, col)) {
        continue;
      }

      sum += getRegionPrice(garden, row, col);
    }
  }

  return sum;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(getFencingPriceOfRegions(await getGardenMap()));
}

export { }
