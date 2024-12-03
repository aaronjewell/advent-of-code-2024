function parseLeftAndRight(lines: string[]): [number[], Map<number, number>] {
  const lefts: number[] = [];
  const rightCounts: Map<number, number> = new Map();
  for (let i = 0; i < lines.length; i++) {
    const [l, r] = lines[i].match(/(\d+)\s+(\d+)/)!.slice(1).map(Number);
    lefts.push(l);
    rightCounts.set(r, (rightCounts.get(r) || 0) + 1);
  }
  return [lefts, rightCounts];
}

async function getLines(): Promise<string[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  return raw.trim().split('\n');
}

function sumProductsOfLeftAndCounts(left: number[], rightCounts: Map<number, number>): number {
  return left
    .map((l) => l * (rightCounts.get(l) || 0))
    .reduce((sum, curr) => sum + curr, 0);
}

const [left, right] = parseLeftAndRight(await getLines());

console.log(sumProductsOfLeftAndCounts(left, right));

export { }
