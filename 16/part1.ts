import { pathToFileURL } from 'url';

interface ReindeerMaze {
  grid: string[][];
  startPos: Vector;
  endPos: Vector;
  columns: number;
  rows: number;
}

type Vector = [number, number];

type Direction = '^' | 'v' | '<' | '>';

const DIRECTIONS: Direction[] = ['^', '>', 'v', '<'];
const DIRECTION_VECTORS: Map<Direction, Vector> = new Map([
  ['^', [-1, 0]],
  ['>', [0, 1]],
  ['v', [1, 0]],
  ['<', [0, -1]],
]);

function* directions(startingDir: Direction): Generator<Direction> {
  let index = DIRECTIONS.indexOf(startingDir);
  while (true) {
    yield DIRECTIONS[index];
    index = (index + 1) % DIRECTIONS.length;
  }
}

async function getReindeerMaze(): Promise<ReindeerMaze> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const text = await file.text();
  return createReindeerMaze(text);
}

function getStartingAndEndingPosition(grid: string[][]): [Vector, Vector] {
  let startingPosition: Vector | undefined;
  let endingPosition: Vector | undefined;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      switch (grid[row][col]) {
        case 'S':
          startingPosition = [row, col];
          break;
        case 'E':
          endingPosition = [row, col];
          break;
        default:
          break;
      }
    }
  }
  return [startingPosition as Vector, endingPosition as Vector];
}

export function createReindeerMaze(text: string): ReindeerMaze {
  const grid = text.trim().split('\n').map(line => line.trim().split(''));
  const [startingPosition, endingPosition] = getStartingAndEndingPosition(grid);
  return {
    grid,
    startPos: startingPosition,
    endPos: endingPosition,
    columns: grid[0].length,
    rows: grid.length,
  };
}

function isExit(maze: ReindeerMaze, [row, col]: Vector): boolean {
  return row === maze.endPos[0] && col === maze.endPos[1];
}

function isWall(maze: ReindeerMaze, [row, col]: Vector): boolean {
  return maze.grid[row][col] === '#';
}

function inBounds(maze: ReindeerMaze, [row, col]: Vector): boolean {
  return row >= 0 && row < maze.rows && col >= 0 && col < maze.columns && !isWall(maze, [row, col]);
}

export function determineLowestScore(maze: ReindeerMaze): number {
  const memo: Map<string, number> = new Map();
  const queue: [number, number, Direction, number][] = [[maze.startPos[0], maze.startPos[1], '>', 0]];
  memo.set(`${maze.startPos[0]},${maze.startPos[1]},>`, 0);

  let minScore = Infinity;

  function exploreDirection(row: number, col: number, dir: Direction, score: number) {
    const [dRow, dCol] = DIRECTION_VECTORS.get(dir)!;
    const key = `${row + dRow},${col + dCol},${dir}`;

    if (inBounds(maze, [row + dRow, col + dCol]) && (!memo.has(key) || memo.get(key)! > score)) {
      memo.set(key, score);
      queue.push([row + dRow, col + dCol, dir, score]);
    }
  }

  while (queue.length > 0) {
    const [row, col, dir, score] = queue.shift()!;
    const memoKey = `${row},${col},${dir}`;

    if (isExit(maze, [row, col])) {
      minScore = Math.min(minScore, score);
      continue;
    }

    if (memo.has(memoKey) && memo.get(memoKey)! < score) {
      continue;
    }

    const nextDirections = directions(dir);

    exploreDirection(row, col, nextDirections.next().value, 1 + score);
    exploreDirection(row, col, nextDirections.next().value, 1001 + score);

    // ignore backwards
    nextDirections.next();

    exploreDirection(row, col, nextDirections.next().value, 1001 + score);

  }

  return minScore;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(determineLowestScore(await getReindeerMaze()));
}
