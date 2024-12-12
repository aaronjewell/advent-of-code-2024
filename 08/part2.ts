async function getAntennaMap(): Promise<string[][]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  return raw.trim().split('\n').map((line) => line.split(''));
}

function getAntennaLocationsByFreq(map: string[][]): Map<string, [number, number][]> {
  const antennaLocations = new Map<string, [number, number][]>();
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const cell = map[row][col];
      if (cell === '.') {
        continue;
      }
      if (!antennaLocations.has(cell)) {
        antennaLocations.set(cell, []);
      }
      antennaLocations.get(cell)!.push([col, row]);
    }
  }
  return antennaLocations;
}

function inBounds(map: string[][], point: [number, number]) {
  const [row, col] = point;
  return row >= 0 && row < map.length && col >= 0 && col < map[row].length;
}

function addVectors(v1: [number, number], v2: [number, number]): [number, number] {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function subtractVectors(v1: [number, number], v2: [number, number]): [number, number] {
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

function serializeVector(v: [number, number]): string {
  return `${v[0]},${v[1]}`;
}

function uniqueAntinodesInBounds(map: string[][]): number {
  const antennaLocations = getAntennaLocationsByFreq(map);
  const antinodes = new Set<string>();

  for (const [_, locations] of antennaLocations) {
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        let p1 = locations[i];
        let p2 = locations[j];

        const displacement = subtractVectors(p2, p1);

        while (inBounds(map, p1)) {
          antinodes.add(serializeVector(p1));
          p1 = subtractVectors(p1, displacement);
        }

        while (inBounds(map, p2)) {
          antinodes.add(serializeVector(p2));
          p2 = addVectors(p2, displacement);
        }
      }
    }
  }

  return antinodes.size;
}

console.log(uniqueAntinodesInBounds(await getAntennaMap()));

export { }
