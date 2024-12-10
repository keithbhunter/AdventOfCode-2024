import { getInputString } from "../../utils";

enum Operator {
  add = 0,
  mul,
  or,
}

type Equation = {
  total: number;
  operands: number[];
};

// 11 + 6 * 16 + 20 = 292
const compute = (operands: number[], operators: number[]): number => {
  if (operators.length !== operands.length - 1) {
    throw new Error("cannot match operators to operands");
  }
  return operands.reduce((acc, operand, index) => {
    if (index === 0) {
      return operand;
    }
    switch (operators[index - 1]) {
      case Operator.add:
        return acc + operand;
      case Operator.mul:
        return acc * operand;
      case Operator.or:
        return +`${acc}${operand}`;
      default:
        throw new Error("unexpect operator");
    }
  }, 0);
};

// operatorPermutations(2) => [[0,0], [0,1], [1,0], [1,1]]
const operatorPermutations = (times: number): Operator[][] => {
  const permutations: Operator[][] = [];
  for (let i = 0; i < 3 ** times; i++) {
    const binaryString = i.toString(3).padStart(times, "0");
    permutations.push([...binaryString].map((char) => +char as Operator));
  }
  return permutations;
};

const parseEquations = (input: string): Equation[] =>
  input.split("\n").map((line) => {
    const [total, allNumbers] = line.split(": ");
    const numbers = allNumbers.split(" ");
    return { total: +total, operands: numbers.map((num) => +num) };
  });

const filterEquationsThatCanBeTrue = (equations: Equation[]): Equation[] =>
  equations.filter((equation) =>
    operatorPermutations(equation.operands.length - 1).some(
      (permutation) =>
        compute(equation.operands, permutation) === equation.total,
    ),
  );

/**
 * Examples
 */

const exampleIn = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

// Part 1: 3749
// Part 2: 11387
const example1 = () => {
  console.log(`${exampleIn}\n`);
  const equations = filterEquationsThatCanBeTrue(parseEquations(exampleIn));
  console.log(equations);
  console.log(equations.reduce((acc, equation) => acc + equation.total, 0));
};

/**
 * Answers
 */

// Part 1: 12553187650171
const part1 = () => {
  const equations = filterEquationsThatCanBeTrue(
    parseEquations(getInputString(7).trim()),
  );
  console.log(equations.reduce((acc, equation) => acc + equation.total, 0));
};

part1();
