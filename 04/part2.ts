async function getWordSearch() {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  return raw.trim().split('\n');
}

export function characterAt(grid: string[], col: number, row: number): string | null {
  if (row < 0 || row >= grid.length) {
    return null;
  }
  if (col < 0 || col >= grid[row].length) {
    return null;
  }
  return grid[row][col];
}

function* rotatedCharacters(): Generator<[string, string, string, string]> {
  yield ['S', 'S', 'M', 'M'];
  yield ['M', 'S', 'S', 'M'];
  yield ['M', 'M', 'S', 'S'];
  yield ['S', 'M', 'M', 'S'];
}

function formsXMas(grid: string[], col: number, row: number, topLeft: string, topRight: string, bottomRight: string, bottomLeft: string): boolean {
  return (
    characterAt(grid, col - 1, row - 1) === topLeft &&
    characterAt(grid, col + 1, row - 1) === topRight &&
    characterAt(grid, col + 1, row + 1) === bottomRight &&
    characterAt(grid, col - 1, row + 1) === bottomLeft
  );
}

function countXMasInWordSearch(grid: string[]): number {
  let count = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (characterAt(grid, col, row) !== 'A') {
        continue;
      }

      for (const [topLeft, topRight, bottomRight, bottomLeft] of rotatedCharacters()) {
        if (formsXMas(grid, col, row, topLeft, topRight, bottomRight, bottomLeft)) {
          count++;
        }
      }
    }
  }
  return count;
}

console.log(countXMasInWordSearch(await getWordSearch()));

export { }
