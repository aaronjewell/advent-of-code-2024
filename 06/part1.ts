import { pathToFileURL } from 'url';

interface PuzzleMap {
  grid: string[][];
  startingPos: [number, number];
  width: number;
  height: number;
}

interface Guard {
  symbol: GuardSymbol;
  position: [number, number];
}

type GuardSymbol = '^' | 'v' | '<' | '>';

function getDirection(guard: Guard): [number, number] {
  switch (guard.symbol) {
    case '^':
      return [0, -1];
    case 'v':
      return [0, 1];
    case '<':
      return [-1, 0];
    case '>':
      return [1, 0];
    default:
      throw new Error('Invalid guard: ' + guard);
  }
}

function turnGuard(guard: Guard) {
  switch (guard.symbol) {
    case '^':
      guard.symbol = '>';
      return
    case 'v':
      guard.symbol = '<';
      return;
    case '<':
      guard.symbol = '^';
      return
    case '>':
      guard.symbol = 'v';
      return
    default:
      throw new Error('Invalid guard: ' + guard.symbol);
  }
}

async function getMap(): Promise<PuzzleMap> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  const lines = raw.trim().split('\n');
  const grid = lines.map((line) => line.split(''));

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === '^') {
        return {
          grid,
          startingPos: [row, col],
          width: grid[row].length,
          height: grid.length,
        };
      }
    }
  }

  throw new Error('No starting position found');
}

function inBounds(map: PuzzleMap, row: number, col: number) {
  return row >= 0 && row < map.height && col >= 0 && col < map.width;
}

function getNextPos(row: number, col: number, direction: [number, number]) {
  const [dx, dy] = direction;
  return [row + dy, col + dx];
}

function isObstacle(map: PuzzleMap, row: number, col: number) {
  return inBounds(map, row, col) && map.grid[row][col] === '#';
}

function markVisited(map: PuzzleMap, row: number, col: number): boolean {
  if (inBounds(map, row, col) && map.grid[row][col] !== 'X') {
    map.grid[row][col] = 'X';
    return true;
  }

  return false;
}

function moveGuard(map: PuzzleMap, guard: Guard, nextRow: number, nextCol: number) {
  if (inBounds(map, nextRow, nextCol)) {
    guard.position = [nextRow, nextCol];
  }
}

function traverseMap(map: PuzzleMap) {
  let visited = 0;
  let [rowPos, colPos] = map.startingPos;
  let guard = { symbol: '^' as GuardSymbol, position: [rowPos, colPos] as [number, number] };
  let direction = getDirection(guard);
  while (inBounds(map, rowPos, colPos)) {
    let [nextRow, nextCol] = getNextPos(rowPos, colPos, direction);

    if (isObstacle(map, nextRow, nextCol)) {
      turnGuard(guard);
      direction = getDirection(guard);
      [nextRow, nextCol] = getNextPos(rowPos, colPos, direction);
    }

    if (markVisited(map, rowPos, colPos)) {
      visited++;
    }

    moveGuard(map, guard, nextRow, nextCol);

    rowPos = nextRow;
    colPos = nextCol
  }

  return visited;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(traverseMap(await getMap()));
}

export { }
