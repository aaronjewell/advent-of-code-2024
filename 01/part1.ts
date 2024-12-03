import assert from 'node:assert';

function parseLeftAndRight(lines: string[]): [number[], number[]] {
  const lefts: number[] = [];
  const rights: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const [l, r] = lines[i].match(/(\d+)\s+(\d+)/)!.slice(1).map(Number);
    lefts.push(l);
    rights.push(r);
  }
  return [lefts, rights];
}

async function getLines(): Promise<string[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  return raw.trim().split('\n');
}

function sortInPlace(list: number[]): void {
  list.sort((a, b) => a - b);
}

function sumListDifferences(left: number[], right: number[]): number {
  let sum = 0;
  for (let i = 0; i < left.length; i++) {
    sum += Math.abs(left[i] - right[i]);
  }
  return sum;
}

const [left, right] = parseLeftAndRight(await getLines());

sortInPlace(left);
sortInPlace(right);

assert(left.length === right.length);

console.log(sumListDifferences(left, right));

export { }
