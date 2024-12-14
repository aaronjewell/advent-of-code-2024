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
  const half = Math.floor(n.toString().length / 2);
  const divisor = Math.pow(10, half);
  const left = Math.floor(n / divisor);
  const right = n % divisor;
  return [left, right];
}

function blink(stones: number[], stoneCache: Map<number, number[]>): number[] {
  const newStones: number[] = [];
  for (const stone of stones) {
    if (stoneCache.has(stone)) {
      newStones.push(...stoneCache.get(stone)!);
      continue;
    }

    if (hasEvenDigits(stone)) {
      const next = splitNumberInTwoParts(stone)
      stoneCache.set(stone, next);
      newStones.push(...next);
    } else if (stone === 0) {
      const next = 1;
      stoneCache.set(stone, [next]);
      newStones.push(next)
    } else {
      const next = stone * 2024;
      stoneCache.set(stone, [next]);
      newStones.push(next)
    }
  }

  return newStones;
}

function afterBlinks(stones: number[], blinkCount: number): number[] {
  const stoneCache = new Map<number, number[]>();
  for (let i = 0; i < blinkCount; i++) {
    stones = blink(stones, stoneCache);
  }
  return stones;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(afterBlinks(await getStones(), 25).length);
}

export { }
