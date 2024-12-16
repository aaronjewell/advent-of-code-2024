const ROBOT = '@';
const WALL = '#';
const EMPTY = '.';
const BOX = 'O';

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
  startingPosition: Vector;
}

async function getWarehouseMapAndMovements(): Promise<[WarehouseMap, Movement[]]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const text = await file.text();
  const [mapLines, movementLines] = text.trim().split('\n\n');

  const movements = movementLines.split('\n').join('').split('');
  const grid = mapLines.split('\n').map(line => line.split(''));
  const map = createWarehouseMap(grid);

  return [map, movements as Movement[]];
}

function createWarehouseMap(grid: string[][]): WarehouseMap {
  return {
    grid,
    columns: grid[0].length,
    rows: grid.length,
    startingPosition: getStartingPosition(grid),
  };
}

function canMove(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && isEmpty(map, position);
}

function shouldPush(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && map.grid[position[0]][position[1]] === BOX;
}

function isBox(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && map.grid[position[0]][position[1]] === BOX;
}

function isEmpty(map: WarehouseMap, position: Vector): boolean {
  return inBounds(map, position) && map.grid[position[0]][position[1]] === EMPTY;
}

function attemptPush(map: WarehouseMap, position: Vector, direction: Vector): void {
  const [dRow, dCol] = direction;
  const [startRow, startCol] = position;
  position = [...position];

  while (isBox(map, position)) {
    position[0] = position[0] + dRow;
    position[1] = position[1] + dCol;
  }

  if (isEmpty(map, position) && (position[0] !== startRow || position[1] !== startCol)) {
    map.grid[position[0]][position[1]] = BOX;
    map.grid[startRow][startCol] = EMPTY;
  }
}

function inBounds(map: WarehouseMap, [row, col]: Vector): boolean {
  return row >= 0 && row < map.rows && col >= 0 && col < map.columns && map.grid[row][col] !== WALL;
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

function applyMovements(map: WarehouseMap, movements: Movement[]) {
  let [row, col] = map.startingPosition;
  map.grid[row][col] = EMPTY;

  for (const movement of movements) {
    const [dRow, dCol] = movementToVectorMap.get(movement)!;
    const [newRow, newCol] = [row + dRow, col + dCol];
    if (shouldPush(map, [newRow, newCol])) {
      attemptPush(map, [newRow, newCol], [dRow, dCol]);
    }
    if (canMove(map, [newRow, newCol])) {
      row = newRow;
      col = newCol;
    }
  }
}

function sumGPSCoordinates(map: WarehouseMap): number {
  let sum = 0;
  for (let row = 0; row < map.rows; row++) {
    for (let col = 0; col < map.columns; col++) {
      if (isBox(map, [row, col])) {
        sum += getGPSCoordinate(row, col);
      }
    }
  }

  return sum;
}

function getGPSCoordinate(row: number, col: number): number {
  return row * 100 + col;
}

const [map, movements] = await getWarehouseMapAndMovements();
applyMovements(map, movements);
console.log(sumGPSCoordinates(map));

export { };
