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

const TRAVELED_DIRECTIONS = {
  '^': 1 << 0,
  'v': 1 << 1,
  '<': 1 << 2,
  '>': 1 << 3,
}

type TraveledDirections = typeof TRAVELED_DIRECTIONS[keyof typeof TRAVELED_DIRECTIONS];

function getDirectionVector(symbol: GuardSymbol): [number, number] {
  switch (symbol) {
    case '^':
      return [0, -1];
    case 'v':
      return [0, 1];
    case '<':
      return [-1, 0];
    case '>':
      return [1, 0];
    default:
      throw new Error('Invalid guard: ' + symbol);
  }
}

function turnGuard(guard: Guard) {
  guard.symbol = rotateGuard(guard);
}

function rotateGuard(guard: Guard): GuardSymbol {
  switch (guard.symbol) {
    case '^':
      return '>';
    case 'v':
      return '<';
    case '<':
      return '^';
    case '>':
      return 'v';
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

function getNextPos(guard: Guard): [number, number] {
  const [row, col] = guard.position;
  const [dx, dy] = getDirectionVector(guard.symbol);
  return [row + dy, col + dx];
}

function isObstacle(map: PuzzleMap, row: number, col: number) {
  return inBounds(map, row, col) && map.grid[row][col] === '#';
}

function markVisited(visited: number[], map: PuzzleMap, direction: TraveledDirections, row: number, col: number) {
  visited[map.width * row + col] |= direction;
}

function isCycle(visited: number[], map: PuzzleMap, direction: TraveledDirections, row: number, col: number): boolean {
  return (visited[map.width * row + col] & direction) !== 0;
}

function moveGuard(guard: Guard) {
  guard.position = getNextPos(guard);
}

function createGuard(map: PuzzleMap): Guard {
  let guard = {
    symbol: '^' as GuardSymbol,
    position: [map.startingPos[0], map.startingPos[1]] as [number, number]
  };

  return guard;
}

function isStartingPos(row: number, col: number, map: PuzzleMap) {
  return row === map.startingPos[0] && col === map.startingPos[1];
}

function createVisited(map: PuzzleMap): number[] {
  return new Array(map.height * map.width).fill(0);
}

function traversingResultsInCycle(map: PuzzleMap, guard: Guard, visited: number[]): boolean {
  while (inBounds(map, ...guard.position)) {
    if (isCycle(visited, map, TRAVELED_DIRECTIONS[guard.symbol], ...guard.position)) {
      return true;
    }

    markVisited(visited, map, TRAVELED_DIRECTIONS[guard.symbol], ...guard.position);

    while (isObstacle(map, ...getNextPos(guard))) {
      turnGuard(guard);
    }

    moveGuard(guard);
  }

  return false;
}

function countCyclesWithAdditionalObstacle(map: PuzzleMap) {
  let cycleCount = 0;
  map.grid[map.startingPos[0]][map.startingPos[1]] = '.';

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < map.width; col++) {
      if (map.grid[row][col] === '.' && !isStartingPos(row, col, map)) {
        map.grid[row][col] = '#';
        const guard = createGuard(map);
        const visited = createVisited(map);

        if (traversingResultsInCycle(map, guard, visited)) {
          cycleCount++;
        }
        map.grid[row][col] = '.';
      }
    }
  }

  return cycleCount;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(countCyclesWithAdditionalObstacle(await getMap()));
}

export { }
