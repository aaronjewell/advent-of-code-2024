import { pathToFileURL } from 'url';

async function getStones(): Promise<number[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const text = await file.text();
  return text.match(/\d+/g)!.map(Number);
}

function digitCount(n: number): number {
  return Math.floor(Math.log10(n)) + 1;
}

export function hasEvenDigits(n: number): boolean {
  return digitCount(n) % 2 === 0;
}

export function splitNumberInTwoParts(n: number): [number, number] {
  // split a number into two parts using remainder and division
  // e.g. 2525 -> 25, 25
  const half = Math.floor(digitCount(n) / 2);
  const divisor = Math.pow(10, half);
  const left = Math.floor(n / divisor);
  const right = n % divisor;
  return [left, right];
}

function getStoneCounts(stones: number[]): Map<number, number> {
  const stoneCounts = new Map<number, number>();
  for (const stone of stones) {
    if (stoneCounts.has(stone)) {
      stoneCounts.set(stone, stoneCounts.get(stone)! + 1);
    } else {
      stoneCounts.set(stone, 1);
    }
  }
  return stoneCounts;
}

function countStones(stoneCounts: Map<number, number>): number {
  let sum = 0;
  for (const [_, count] of stoneCounts) {
    sum += count;
  }
  return sum;
}

function blink(stoneCounts: Map<number, number>, stoneCache: Map<number, number[]>): Map<number, number> {
  const newStoneCounts = new Map<number, number>();
  for (const [stone, count] of stoneCounts) {
    if (stoneCache.has(stone)) {
      for (const next of stoneCache.get(stone)!) {
        newStoneCounts.set(next, (newStoneCounts.get(next) ?? 0) + count);
      }
      continue;
    }

    if (hasEvenDigits(stone)) {
      const [s1, s2] = splitNumberInTwoParts(stone)
      stoneCache.set(stone, [s1, s2]);
      newStoneCounts.set(s1, (newStoneCounts.get(s1) ?? 0) + count);
      newStoneCounts.set(s2, (newStoneCounts.get(s2) ?? 0) + count);
    } else if (stone === 0) {
      const next = 1;
      stoneCache.set(stone, [next]);
      newStoneCounts.set(next, (newStoneCounts.get(next) ?? 0) + count);
    } else {
      const next = stone * 2024;
      stoneCache.set(stone, [next]);
      newStoneCounts.set(next, (newStoneCounts.get(next) ?? 0) + count);
    }
  }

  return newStoneCounts;
}

function afterBlinks(stoneCounts: Map<number, number>, blinkCount: number): Map<number, number> {
  const stoneCache = new Map<number, number[]>();
  for (let i = 0; i < blinkCount; i++) {
    stoneCounts = blink(stoneCounts, stoneCache);
  }
  return stoneCounts;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(countStones(afterBlinks(getStoneCounts(await getStones()), 75)));
}

export { }
