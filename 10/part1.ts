async function getTopographicalMap(): Promise<number[][]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const text = await file.text();
  return text
    .trim()
    .split('\n')
    .map(line => line.split('').map(Number));
}

type Point = [number, number];

function* directions(): Generator<Point> {
  yield [0, 1];
  yield [1, 0];
  yield [0, -1];
  yield [-1, 0];
}

function inBounds(topoMap: number[][], [row, col]: Point): boolean {
  return row >= 0 && row < topoMap.length && col >= 0 && col < topoMap[0].length;
}

function getTrailheadScore(trailhead: Point, topoMap: number[][]): number {
  let score = 0;
  let elevation = 0;
  let queue: Point[] = [trailhead];
  let visitedEnds = new Set<string>();

  while (queue.length) {
    const n = queue.length;

    for (let i = 0; i < n; i++) {
      const [row, col] = queue.shift()!;

      if (elevation === 9 && !visitedEnds.has(`${row},${col}`)) {
        visitedEnds.add(`${row},${col}`);
        score++;
        continue;
      }

      for (const [dx, dy] of directions()) {
        if (inBounds(topoMap, [row + dy, col + dx])) {
          if (topoMap[row + dy][col + dx] === elevation + 1) {
            queue.push([row + dy, col + dx]);
          }
        }
      }
    }

    elevation++;
  }

  return score;
}

function traverseTopographicalMap(topoMap: number[][]): number {
  let trailheadScoreSum = 0;
  for (let row = 0; row < topoMap.length; row++) {
    for (let col = 0; col < topoMap[0].length; col++) {
      if (topoMap[row][col] === 0) {
        trailheadScoreSum += getTrailheadScore([row, col], topoMap);
      }
    }
  }
  return trailheadScoreSum;
}

console.log(traverseTopographicalMap(await getTopographicalMap()));

export { };
