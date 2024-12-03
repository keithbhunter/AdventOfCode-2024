import { getInputString } from "../../utils";

type Mul = {
  x: number;
  y: number;
};

const multiply = (mul: Mul) => mul.x * mul.y;

function scanMulInstructions(input: string): Mul[] {
  const re = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const instructions = input.matchAll(re);
  const parsedInstructions: Mul[] = [];

  for (const match of instructions) {
    parsedInstructions.push({ x: +match[1], y: +match[2] });
  }
  return parsedInstructions;
}

function multiplyAllInstructions(input: string): number {
  const instructions = scanMulInstructions(input);
  return instructions.reduce((acc, instr) => (acc += multiply(instr)), 0);
}

/**
 * Examples
 */

const example =
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

function example1() {
  console.log(multiplyAllInstructions(example));
}

/**
 * Answers
 */

function part1() {
  console.log(multiplyAllInstructions(getInputString(3)));
}

part1();
