import { createReadStream, readFileSync } from "fs";
import { createInterface } from "readline";

function distanceBetweenLists(a: number[], b: number[]): number {
  return a.reduce((acc, _, index) => (acc += Math.abs(a[index] - b[index])), 0);
}

function numberOfOccurancesInList(value: number, list: number[]): number {
  return list.reduce(
    (acc, currentValue) => (acc += currentValue === value ? 1 : 0),
    0,
  );
}

function similarity(a: number[], b: number[]): number {
  return a.reduce(
    (acc, _, index) =>
      (acc += a[index] * numberOfOccurancesInList(a[index], b)),
    0,
  );
}

/**
 * Examples
 */

const exampleListA = [3, 4, 2, 1, 3, 3].sort();
const exampleListB = [4, 3, 5, 3, 9, 3].sort();

function example1() {
  console.log(distanceBetweenLists(exampleListA, exampleListB));
}

function example2() {
  console.log(similarity(exampleListA, exampleListB));
}

/**
 * Answers
 */

async function getInput() {
  const readStream = createReadStream("day/1/input.txt", { encoding: "utf-8" });
  const rl = createInterface(readStream);
  var a: number[] = [],
    b: number[] = [];

  for await (const line of rl) {
    const nums = line.split("   ");
    a.push(+nums[0]);
    b.push(+nums[1]);
  }
  return [a.sort(), b.sort()];
}

async function part1() {
  const [a, b] = await getInput();
  console.log(distanceBetweenLists(a, b));
}

async function part2() {
  const [a, b] = await getInput();
  console.log(similarity(a, b));
}

part2();
