import { pathToFileURL } from 'url';

interface Equation {
  operands: number[];
  testValue: number;
}

async function getEquations(): Promise<Equation[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  const lines = raw.trim().split('\n');

  return lines.map((line) => {
    const [rawTestValue, rawOperands] = line.split(':');
    const operands = rawOperands.trim().match(/(\d+)+/g)!.map(Number);
    return {
      operands: operands.reverse(),
      testValue: Number(rawTestValue)
    };
  });
}

export function isValidTestValue(requiredTestValue: number, currentValue: number, operands: number[]): boolean {
  if (operands.length === 0) {
    return currentValue === requiredTestValue;
  }

  if (currentValue > requiredTestValue) {
    return false;
  }

  const nextOperand = operands.pop();

  if (isValidTestValue(requiredTestValue, currentValue + nextOperand!, operands)) {
    return true;
  }

  if (isValidTestValue(requiredTestValue, (currentValue || 1) * nextOperand!, operands)) {
    return true;
  }

  if (isValidTestValue(requiredTestValue, Number(`${currentValue}${nextOperand!}`), operands)) {
    return true;
  }

  operands.push(nextOperand!);

  return false;
}

export function getTotalCalibrationResult(equations: Equation[]): number {
  let sum = 0;
  for (const equation of equations) {
    const { operands, testValue } = equation;
    if (isValidTestValue(testValue, 0, operands)) {
      sum += testValue;
    }
  }
  return sum;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(getTotalCalibrationResult(await getEquations()));
}

export { }
