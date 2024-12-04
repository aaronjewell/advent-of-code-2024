import { pathToFileURL } from 'url';

async function getLines(): Promise<string[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  return raw.trim().split('\n');
}

type Instruction = ['mul', number, number] | ['do'] | ['don\'t']

export function findInstructions(line: string): Instruction[] {
  return line
    .matchAll(/(mul|do|don't)\((?:(\d+),(\d+))?\)/g)!
    .map(parseInstruction)
    .toArray();
}

function parseInstruction(match: RegExpMatchArray): Instruction {
  switch (match[1]) {
    case 'mul':
      return ['mul', Number(match[2]), Number(match[3])];
    case 'do':
      return ['do'];
    case 'don\'t':
      return ['don\'t'];
    default:
      throw new Error(`Unknown operator: ${match[1]}`);
  }
}

class Processor {
  #enabled = true;
  #sum = 0;

  #executeInstruction(inst: Instruction): void {
    const [operator, operand1, operand2] = inst;
    switch (operator) {
      case 'mul':
        if (this.#enabled) {
          this.#sum += operand1 * operand2;
        }
        break;
      case 'do':
        this.#enabled = true;
        break;
      case 'don\'t':
        this.#enabled = false;
        break;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  sumInstructions(instructions: Instruction[]): number {
    for (const inst of instructions) {
      this.#executeInstruction(inst);
    }
    return this.#sum;
  }
}



if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const instructions = (await getLines()).flatMap(findInstructions)
  const processor = new Processor();
  console.log(processor.sumInstructions(instructions));
}

export { }
