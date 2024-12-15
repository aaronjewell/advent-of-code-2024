const A_TOKEN_COST = 3;
const B_TOKEN_COST = 1;
const PRIZE_OFFSET = 10_000_000_000_000

type Vector = [number, number];

interface ClawMachine {
  buttonA: Vector,
  buttonB: Vector,
  prize: Vector,
}

// ax + by = c
interface Equation {
  a: number,
  b: number,
  c: number,
}

function parseClawMachine(text: string): ClawMachine {
  const [buttonALine, buttonBLine, prizeLine] = text.split('\n');

  const [_a, aX, aY] = buttonALine.match(/X\+(\d+), Y\+(\d+)/)!;
  const [_b, bX, bY] = buttonBLine.match(/X\+(\d+), Y\+(\d+)/)!;
  const [_p, pX, pY] = prizeLine.match(/X=(\d+), Y=(\d+)/)!;

  return {
    buttonA: [Number(aX), Number(aY)] as Vector,
    buttonB: [Number(bX), Number(bY)] as Vector,
    prize: [Number(pX) + PRIZE_OFFSET, Number(pY) + PRIZE_OFFSET] as Vector,
  }
}

async function getClawMachines(): Promise<ClawMachine[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const text = await file.text();
  const machines = text.trim().split('\n\n');
  return machines.map(parseClawMachine);
}

function solveSystemOfTwoEquations(equation1: Equation, equation2: Equation): null | { x: number, y: number } {
  const { a: a1, b: b1, c: c1 } = equation1;
  const { a: a2, b: b2, c: c2 } = equation2;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    return null;
  }

  const x = (c1 * b2 - c2 * b1) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  return { x, y };
}

function getTokenCount(machine: ClawMachine): number {
  const equation1 = {
    a: machine.buttonA[0],
    b: machine.buttonB[0],
    c: machine.prize[0],
  };

  const equation2 = {
    a: machine.buttonA[1],
    b: machine.buttonB[1],
    c: machine.prize[1],
  };

  const solution = solveSystemOfTwoEquations(equation1, equation2);

  if (!solution) {
    return 0;
  }

  const { x: aPresses, y: bPresses } = solution;

  return calculateTokenCost(aPresses, bPresses);
}

function calculateTokenCost(aPresses: number, bPresses: number): number {
  if (aPresses % 1 !== 0 || bPresses % 1 !== 0) {
    return 0;
  }

  return aPresses * A_TOKEN_COST + bPresses * B_TOKEN_COST;
}

function sumWinnableMachineTokenCosts(machines: ClawMachine[]): number {
  return machines.reduce((sum, machine) => sum + getTokenCount(machine), 0);
}

console.log(sumWinnableMachineTokenCosts(await getClawMachines()));

export { }
