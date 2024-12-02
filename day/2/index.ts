import { getInputLineIteratorForDay } from "../../utils";

function unsafeLevel(report: number[]): number | undefined {
  let isIncreasing = false;

  for (var i = 1; i < report.length; i++) {
    const levelA = report[i - 1];
    const levelB = report[i];

    const difference = Math.abs(levelA - levelB);
    if (difference < 1 || difference > 3) {
      return i;
    }

    if (i === 1) {
      isIncreasing = levelA < levelB;
    }
    if (levelA > levelB && isIncreasing) {
      return i;
    }
    if (levelA < levelB && !isIncreasing) {
      return i;
    }
  }
  return undefined;
}

function numberOfSafeReports(reports: number[][]): number {
  return reports.reduce(
    (acc, report) => (acc += unsafeLevel(report) === undefined ? 1 : 0),
    0,
  );
}

function numOfSafeReportsWithProblemDampener(reports: number[][]): number {
  const unsafeLevelRemovingLevel = (
    report: number[],
    level: number,
  ): number | undefined => {
    const copy = [...report];
    copy.splice(level, 1);
    return unsafeLevel(copy);
  };

  let safeNum = 0;
  for (const report of reports) {
    const level = unsafeLevel(report);
    if (level === undefined) {
      safeNum++;
      continue;
    }

    // Try removing each level once and see if that makes it safe.
    for (let i = 0; i < report.length; i++) {
      const level = unsafeLevelRemovingLevel(report, i);
      if (level === undefined) {
        safeNum++;
        break;
      }
    }
  }
  return safeNum;
}

/**
 * Examples
 */

const example = [
  [7, 6, 4, 2, 1],
  [1, 2, 7, 8, 9],
  [9, 7, 6, 2, 1],
  [1, 3, 2, 4, 5],
  [8, 6, 4, 4, 1],
  [1, 3, 6, 7, 9],
];

function example1() {
  console.log(numberOfSafeReports(example));
}

function example2() {
  console.log(numOfSafeReportsWithProblemDampener(example));
}

/**
 * Answers
 */

async function getInput() {
  let reports: number[][] = [];
  for await (const line of getInputLineIteratorForDay(2)) {
    const levels = line.split(" ");
    reports.push(levels.map((l) => +l));
  }
  return reports;
}

async function part1() {
  const reports = await getInput();
  console.log(numberOfSafeReports(reports));
}

async function part2() {
  const reports = await getInput();
  console.log(numOfSafeReportsWithProblemDampener(reports));
}

part2();
