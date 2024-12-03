async function getReports(): Promise<string[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  return raw.trim().split('\n');
}

function parseLevels(line: string): number[] {
  return line.match(/(\d+)/g)!.map(Number);
}

function isSafeReport(levels: number[], allowedRemovals = 1): boolean {
  let isIncreasing = levels[0] < levels[1];

  for (let i = 1; i < levels.length; i++) {
    const lowerLevel = isIncreasing ? levels[i - 1] : levels[i];
    const higherLevel = isIncreasing ? levels[i] : levels[i - 1];

    if (!areLevelsChangingGradually(lowerLevel, higherLevel)) {
      if (allowedRemovals) {
        const withoutCurrent = levels.toSpliced(i, 1);
        const withoutPrevious = levels.toSpliced(i - 1, 1);
        return isSafeReport(withoutPrevious, allowedRemovals - 1) || isSafeReport(withoutCurrent, allowedRemovals - 1);
      }
      return false;
    }
  }
  return true;
}

function areLevelsChangingGradually(lowerLevel: number, higherLevel: number): boolean {
  const diff = higherLevel - lowerLevel;
  return diff <= 3 && diff >= 1;
}

function onlySafeReports(reports: string[]): string[] {
  return reports.filter(r => isSafeReport(parseLevels(r)));
}

console.log(onlySafeReports(await getReports()).length);

export { }
