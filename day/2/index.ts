import { getInputLineIteratorForDay } from "../../utils";

function isSafe(report: number[]): boolean {
  let isIncreasing = false;

  for (var i = 1; i < report.length; i++) {
    const levelA = report[i - 1];
    const levelB = report[i];

    const difference = Math.abs(levelA - levelB);
    if (difference < 1 || difference > 3) {
      return false;
    }

    if (i === 1) {
      isIncreasing = levelA < levelB;
    }
    if (levelA > levelB && isIncreasing) {
      return false;
    }
    if (levelA < levelB && !isIncreasing) {
      return false;
    }
  }
  return true;
}

function numberOfSafeReports(reports: number[][]): number {
  return reports.reduce((acc, report) => (acc += isSafe(report) ? 1 : 0), 0);
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

part1();
