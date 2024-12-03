import { getInputString } from "../../utils";

type Mul = {
  type: "mul";
  x: number;
  y: number;
};

type Do = { type: "do" };
type Dont = { type: "don't" };

type Instruction = Mul | Do | Dont;

const isMul = (instr: Instruction): instr is Mul => instr.type === "mul";
const isDo = (instr: Instruction): instr is Do => instr.type === "do";
const isDont = (instr: Instruction): instr is Dont => instr.type === "don't";

const multiply = (mul: Mul) => mul.x * mul.y;

function scanMulInstructions(input: string): Instruction[] {
  const re = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don\'t\(\)/g;
  const instructions = input.matchAll(re);
  const parsedInstructions: Instruction[] = [];

  for (const match of instructions) {
    if (match[0].startsWith("mul")) {
      parsedInstructions.push({ type: "mul", x: +match[1], y: +match[2] });
    } else if (match[0] === "do()") {
      parsedInstructions.push({ type: "do" });
    } else if (match[0] === "don't()") {
      parsedInstructions.push({ type: "don't" });
    }
  }
  return parsedInstructions;
}

function multiplyAllInstructions(input: string): number {
  let enabled = true;
  let sum = 0;

  for (const instruction of scanMulInstructions(input)) {
    if (isDo(instruction)) {
      enabled = true;
      continue;
    }

    if (isDont(instruction)) {
      enabled = false;
      continue;
    }

    if (enabled && isMul(instruction)) {
      sum += multiply(instruction);
    }
  }
  return sum;
}

/**
 * Examples
 */

const example1input =
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

const example2input =
  "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

function example1() {
  // 161
  console.log(multiplyAllInstructions(example1input));
}

function example2() {
  // 48
  console.log(multiplyAllInstructions(example2input));
}

/**
 * Answers
 */

function part1() {
  console.log(multiplyAllInstructions(getInputString(3)));
}

part1();
