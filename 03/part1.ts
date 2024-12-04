import { pathToFileURL } from 'url';

async function getLines(): Promise<string[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  return raw.trim().split('\n');
}

type Operation = 'mul'

type Instruction = [Operation, number, number]

export function findInstructions(line: string): Instruction[] {
  return line
    .matchAll(/(mul)\((\d+),(\d+)\)/g)!
    .map(parseInstruction)
    .toArray();
}

function parseInstruction(match: RegExpMatchArray): Instruction {
  return [match[1] as Operation, Number(match[2]), Number(match[3])];
}

function executeInstruction(inst: Instruction): number {
  const [operator, operand1, operand2] = inst;
  switch (operator) {
    case 'mul':
      return operand1 * operand2;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

function sumInstructions(instructions: Instruction[]): number {
  return instructions.reduce((sum, inst) => sum + executeInstruction(inst), 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const instructions = (await getLines()).flatMap(findInstructions)
  console.log(sumInstructions(instructions));
}

export { }
