import { pathToFileURL } from 'url';

type RawPageOrderingRule = string;
type RawPageUpdates = string;
type OrderingRule = [string, string];
type PageUpdates = string[];

async function getInputParts(): Promise<[RawPageOrderingRule[], RawPageUpdates[]]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  const raw = await file.text();
  const lines = raw.trim().split('\n');
  const split = lines.indexOf('');

  return [lines.slice(0, split), lines.slice(split + 1)];
}

function parsePageOrderingRules(rawRules: RawPageOrderingRule[]): OrderingRule[] {
  const rules: OrderingRule[] = [];
  for (const r of rawRules) {
    rules.push(r.split('|') as [string, string])
  }
  return rules;
}

function parsePageUpdates(rawUpdates: RawPageUpdates[]): PageUpdates[] {
  const updates: string[][] = [];
  for (const u of rawUpdates) {
    updates.push(u.split(','));
  }
  return updates;
}

function buildAdjacencyList(orderingRules: OrderingRule[]): Map<string, string[]> {
  const adjacencyList = new Map<string, string[]>();

  for (const [parent, child] of orderingRules) {
    if (!adjacencyList.has(parent)) {
      adjacencyList.set(parent, []);
    }
    adjacencyList.get(parent)!.push(child);
  }

  return adjacencyList;
}

function filterRulesThatApplyToUpdate(orderingRules: OrderingRule[], updates: PageUpdates): OrderingRule[] {
  const pageSet = new Set(updates);

  return orderingRules.filter(([parent, child]) => pageSet.has(parent) && pageSet.has(child));
}

function sortPageOrderings(adjacencyList: Map<string, string[]>): string[] {
  const sorted: string[] = [];
  const visited = new Set<string>();
  function visit(page: string) {
    visited.add(page);
    for (const laterPage of adjacencyList.get(page) ?? []) {
      if (!visited.has(laterPage)) {
        visit(laterPage);
      }
    }
    sorted.push(page);
  }
  for (const [page] of adjacencyList) {
    if (!visited.has(page))
      visit(page);
  }

  return sorted.reverse();
}

function comparePageUpdatesToOrdering(orderingRules: OrderingRule[], updates: string[][]): string[][] {
  const orderedUpdates: string[][] = [];

  for (const update of updates) {
    const filteredRules = filterRulesThatApplyToUpdate(orderingRules, update);
    const adjacencyList = buildAdjacencyList(filteredRules);
    const sortedOrderings = sortPageOrderings(adjacencyList);

    if (checkPageUpdateAgainstOrdering(sortedOrderings, update)) {
      orderedUpdates.push(update);
    }
  }

  return orderedUpdates;
}

function checkPageUpdateAgainstOrdering(sortedOrderings: string[], update: string[]): boolean {
  if (sortedOrderings.length !== update.length) {
    return false;
  }

  for (let i = 0; i < sortedOrderings.length; i++) {
    if (sortedOrderings[i] !== update[i]) {
      return false;
    }
  }

  return true;
}

function getMiddlePage(pageUpdates: string[]): string {
  return pageUpdates[Math.trunc(pageUpdates.length / 2)];
}

function sumMiddlePages(correctPageUpdates: string[][]): number {
  return correctPageUpdates.map(getMiddlePage).reduce((sum, page) => sum + Number(page), 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {

  const [rawPageOrderingRules, rawPageUpdates] = await getInputParts();
  const pageUpdates = parsePageUpdates(rawPageUpdates);
  const orderingRules = parsePageOrderingRules(rawPageOrderingRules);
  const correctUpdates = comparePageUpdatesToOrdering(orderingRules, pageUpdates);

  console.log(sumMiddlePages(correctUpdates));
}

export { }
