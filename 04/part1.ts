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

function* directions(): Generator<[number, number]> {
  yield [1, -1];  // right-up
  yield [1, 0];   // right
  yield [1, 1];   // right-down
  yield [0, 1];   // down
  yield [-1, 1];  // left-down
  yield [-1, 0];  // left
  yield [-1, -1]; // left-up
  yield [0, -1];  // up
}

function searchForTargetWord(grid: string[], col: number, row: number, dx: number, dy: number, targetWord: string): boolean {
  let word: string = '';
  while (word !== targetWord && word.length < targetWord.length) {
    const char = characterAt(grid, col, row);
    if (char === null) {
      break;
    }
    word += char;

    col += dx;
    row += dy;
  }
  return word == targetWord;;
}

function countWordInWordSearch(grid: string[], targetWord: string): number {
  let count = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (characterAt(grid, col, row) !== targetWord[0]) {
        continue;
      }

      for (const [dx, dy] of directions()) {
        const wasFound = searchForTargetWord(grid, col, row, dx, dy, targetWord);

        if (wasFound) {
          count++;
        }
      }
    }
  }
  return count;
}

console.log(countWordInWordSearch(await getWordSearch(), 'XMAS'));

export { }
