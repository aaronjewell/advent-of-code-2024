const ROBOT = '@';
const WALL = '#';
const EMPTY = '.';
const BOX = 'O';
const BOX_LEFT = '[';
const BOX_RIGHT = ']';

type Vector = [number, number];
type Movement = '^' | 'v' | '<' | '>';

const movementToVectorMap: Map<Movement, Vector> = new Map([
  ['^', [-1, 0]],
  ['v', [1, 0]],
  ['<', [0, -1]],
  ['>', [0, 1]],
]);

interface WarehouseMap {
  grid: string[][];
  columns: number;
  rows: number;
}

async function getWarehouseMapAndMovements(): Promise<[WarehouseMap, Movement[]]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const text = await file.text();
  const [mapLines, movementLines] = text.trim().split('\n\n');

  const movements = movementLines.split('\n').join('').split('');
  const grid = mapLines.split('\n').map(line => line.split(''));
  const map = createWarehouseMap(projectGridToWide(grid));

  return [map, movements as Movement[]];
}

function projectGridToWide(grid: string[][]): string[][] {
  const wideGrid: string[][] = new Array(grid.length);
  for (let row = 0; row < grid.length; row++) {
    const projRow = new Array(grid[row].length * 2);
    for (let col = 0; col < grid[row].length; col++) {
      switch (grid[row][col]) {
        case WALL:
          projRow[col * 2] = WALL;
          projRow[col * 2 + 1] = WALL;
          break;
        case EMPTY:
          projRow[col * 2] = EMPTY;
          projRow[col * 2 + 1] = EMPTY;
          break;
        case ROBOT:
          projRow[col * 2] = ROBOT;
          projRow[col * 2 + 1] = EMPTY;
          break;
        case BOX:
          projRow[col * 2] = BOX_LEFT;
          projRow[col * 2 + 1] = BOX_RIGHT;
          break;
        default:
          throw new Error(`Invalid character: ${row[col]}`);
      }
    }
    wideGrid[row] = projRow;
  }
  return wideGrid;
}

function createWarehouseMap(grid: string[][]): WarehouseMap {
  return {
    grid,
    columns: grid[0].length,
    rows: grid.length,
  };
}

function canMove(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && isEmpty(map, position);
}

function shouldPush(map: WarehouseMap, position: Vector): boolean {
  return isBox(map, position);
}

function isLeftBox(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && map.grid[position[0]][position[1]] === BOX_LEFT;
}

function isRightBox(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && map.grid[position[0]][position[1]] === BOX_RIGHT;
}

function isBox(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && (isLeftBox(map, position) || isRightBox(map, position));
}

function isEmpty(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && map.grid[position[0]][position[1]] === EMPTY;
}

function inBounds(map: WarehouseMap, [row, col]: Vector): boolean {
  return row >= 0 && row < map.rows && col >= 0 && col < map.columns && map.grid[row][col] !== WALL;
}

function moveRobot(map: WarehouseMap, before: Vector, after: Vector): void {
  map.grid[after[0]][after[1]] = ROBOT;
  map.grid[before[0]][before[1]] = EMPTY;
}

function attemptHorizontalPush(map: WarehouseMap, position: Vector, direction: Vector): boolean {
  if (isEmpty(map, position)) {
    return true;
  }

  if (!inBounds(map, position)) {
    return false;
  }

  const [_, dCol] = direction;
  const [row, col] = position;
  const next: Vector = [row, col + dCol];

  const shouldPush = attemptHorizontalPush(map, next, direction);

  if (shouldPush) {
    map.grid[next[0]][next[1]] = map.grid[row][col];
    map.grid[row][col] = EMPTY;
  }

  return shouldPush;
}

function canVerticalPush(map: WarehouseMap, position: Vector, direction: Vector): boolean {
  if (isEmpty(map, position)) {
    return true;
  }
  if (!inBounds(map, position)) {
    return false;
  }

  const [row, col] = position;
  const [dRow, _] = direction;
  const next: Vector = [row + dRow, col];

  let shouldPush = false;

  switch (map.grid[position[0]][position[1]]) {
    case BOX_LEFT:
      shouldPush = canVerticalPush(map, next, direction)
        && canVerticalPush(map, [next[0], col + 1], direction);
      break;
    case BOX_RIGHT:
      shouldPush = canVerticalPush(map, next, direction)
        && canVerticalPush(map, [next[0], col - 1], direction);
      break;
    default:
      throw new Error(`Invalid character: ${map.grid[position[0]][position[1]]}`);
  }

  return shouldPush;
}

function pushVertical(map: WarehouseMap, position: Vector, direction: Vector): void {
  if (isEmpty(map, position)) {
    return;
  }

  const [dRow, _] = direction;
  const [row, col] = position;
  const next: Vector = [row + dRow, col];

  switch (map.grid[position[0]][position[1]]) {
    case BOX_LEFT:
      pushVertical(map, next, direction)
      pushVertical(map, [next[0], col + 1], direction);
      break;
    case BOX_RIGHT:
      pushVertical(map, next, direction)
      pushVertical(map, [next[0], col - 1], direction);
      break;
    default:
      throw new Error(`Invalid character: ${map.grid[position[0]][position[1]]}`);
  }


  map.grid[next[0]][next[1]] = map.grid[row][col];
  map.grid[row][col] = EMPTY;

  switch (map.grid[next[0]][col]) {
    case BOX_LEFT:
      map.grid[next[0]][col + 1] = BOX_RIGHT;
      map.grid[row][col + 1] = EMPTY;
      break;
    case BOX_RIGHT:
      map.grid[next[0]][col - 1] = BOX_LEFT;
      map.grid[row][col - 1] = EMPTY;
      break;
    default:
      throw new Error(`Invalid character: ${map.grid[next[0]][col]}`);
  }
}

function getStartingPosition(map: string[][]): [number, number] {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === ROBOT) {
        return [row, col];
      }
    }
  }
  throw new Error('Starting position not found');
}

function printMap(map: WarehouseMap) {
  for (const row of map.grid) {
    console.log(row.join(''));
  }
}

function applyMovements(map: WarehouseMap, movements: Movement[]) {
  let [row, col] = getStartingPosition(map.grid);

  for (const movement of movements) {
    const direction = movementToVectorMap.get(movement)!;
    const [dRow, dCol] = direction;
    const next: Vector = [row + dRow, col + dCol];
    if (shouldPush(map, next)) {
      // @TODO: reduce duplication and identify common algorithm in vert/horiz push
      if (dCol !== 0) {
        attemptHorizontalPush(map, next, direction);
      } else {
        if (canVerticalPush(map, next, direction)) {
          pushVertical(map, next, direction);
        }
      }
    }
    if (canMove(map, next)) {
      moveRobot(map, [row, col], next);
      row = next[0];
      col = next[1];
    }
  }
  printMap(map);
}

function sumGPSCoordinates(map: WarehouseMap): number {
  let sum = 0;
  for (let row = 0; row < map.rows; row++) {
    for (let col = 0; col < map.columns; col++) {
      if (isLeftBox(map, [row, col])) {
        sum += getGPSCoordinate(row, col);
      }
    }
  }

  return sum;
}

function getGPSCoordinate(row: number, col: number): number {
  return row * 100 + col;
}


async function startWithKeyboard() {
  const [map, _movements] = await getWarehouseMapAndMovements();
  printMap(map);
  // read keyboard input and translate to directions
  for await (const line of console) {
    switch (line) {
      case 'w':
        applyMovements(map, ['^']);
        break;
      case 's':
        applyMovements(map, ['v']);
        break;
      case 'a':
        applyMovements(map, ['<']);
        break;
      case 'd':
        applyMovements(map, ['>']);
        break;
      default:
        console.log('Invalid input');
    }
  }
}

async function start() {
  const [map, movements] = await getWarehouseMapAndMovements();
  applyMovements(map, movements);
  console.log(sumGPSCoordinates(map));
}

await start();

export { };
