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

function isPerimeter(garden: string[][], plantType: string, row: number, col: number): boolean {
  if (!inBounds(garden, row, col)) {
    return true;
  }
  return garden[row][col] !== plantType && garden[row][col] !== plantType.toLowerCase();
}

function markVisited(garden: string[][], row: number, col: number): void {
  garden[row][col] = garden[row][col].toLowerCase();
}

function isVisited(garden: string[][], row: number, col: number): boolean {
  return garden[row][col] >= "a";
}

function getRegionPrice(garden: string[][], row: number, col: number): number {
  let area = 0;
  let perimeter = 0;
  let plantType = garden[row][col];

  let queue = [[row, col]];

  while (queue.length) {
    let n = queue.length;

    for (let i = 0; i < n; i++) {
      const [row, col] = queue.shift()!;
      if (!inBounds(garden, row, col) || isVisited(garden, row, col)) {
        continue;
      }

      markVisited(garden, row, col);
      area++;

      for (const [dr, dc] of directions()) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isPerimeter(garden, plantType, newRow, newCol)) {
          perimeter++;
        } else {
          queue.push([newRow, newCol]);
        }
      }
    }
  }

  return area * perimeter;
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

console.log(getFencingPriceOfRegions(await getGardenMap()));

export { }
