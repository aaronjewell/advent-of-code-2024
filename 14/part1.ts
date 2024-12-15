const ROWS = 103;
const COLS = 101;
const MIDDLE_ROW = Math.trunc((ROWS - 1) / 2);
const MIDDLE_COL = Math.trunc((COLS - 1) / 2);

type Row = number;
type Col = number;
type RowVel = number;
type ColVel = number;

type Vector<T1, T2> = [T1, T2];

interface Robot {
  position: Vector<Row, Col>,
  velocity: Vector<RowVel, ColVel>,
}

const TOP_LEFT_QUADRANT = 5;
const TOP_RIGHT_QUADRANT = 6;
const BOTTOM_LEFT_QUADRANT = 9;
const BOTTOM_RIGHT_QUADRANT = 10;

type TopLeft = typeof TOP_LEFT_QUADRANT;
type TopRight = typeof TOP_RIGHT_QUADRANT;
type BottomLeft = typeof BOTTOM_LEFT_QUADRANT;
type BottomRight = typeof BOTTOM_RIGHT_QUADRANT;
type Quadrant = TopLeft | TopRight | BottomLeft | BottomRight;

function parseRobot(line: string): Robot {
  const [_, colPos, rowPos, colVel, rowVel] = line.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/)!.map(Number);
  return {
    position: [rowPos, colPos],
    velocity: [rowVel, colVel],
  };
}

async function getRobots(): Promise<Robot[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const text = await file.text();
  const lines = text.trim().split('\n');
  return lines.map(parseRobot);
}

function nextRow(deltaT: number, row: Row, velocity: RowVel): Row {
  return ((row + deltaT * velocity) % ROWS + ROWS) % ROWS;
}

function nextCol(deltaT: number, col: Col, velocity: ColVel): Col {
  return ((col + deltaT * velocity) % COLS + COLS) % COLS;
}

function predictPosition(deltaT: number, robot: Robot): [Row, Col] {
  return [
    nextRow(deltaT, robot.position[0], robot.velocity[0]),
    nextCol(deltaT, robot.position[1], robot.velocity[1]),
  ];
}

function quadrant(pos: Vector<Row, Col>): null | Quadrant {
  if (pos[0] < 0 || pos[0] > ROWS - 1 || pos[1] < 0 || pos[1] > COLS - 1) {
    throw new Error(`Invalid position: ${pos}`);
  }

  if (pos[0] === MIDDLE_ROW || pos[1] === MIDDLE_COL) {
    return null;
  }

  const horizontal = pos[0] < MIDDLE_ROW ? 1 : 2;
  const vertical = pos[1] < MIDDLE_COL ? 4 : 8;

  return (horizontal | vertical) as Quadrant;
}

function calculateSafetyFactor(robots: Robot[], deltaT: number): number {
  const quadrantMap = new Map<Quadrant, number>([
    [TOP_LEFT_QUADRANT, 0],
    [TOP_RIGHT_QUADRANT, 0],
    [BOTTOM_LEFT_QUADRANT, 0],
    [BOTTOM_RIGHT_QUADRANT, 0],
  ]);

  for (const robot of robots) {
    const q = quadrant(predictPosition(deltaT, robot));

    if (q) {
      quadrantMap.set(q, quadrantMap.get(q)! + 1);
    }
  }

  return quadrantMap
    .values()
    .reduce((product, count) => product * count, 1);
}

console.log(calculateSafetyFactor(await getRobots(), 100));

export { };
