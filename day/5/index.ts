import { getInputString } from "../../utils";

type Rule = {
  before: number;
  after: number;
};

const parseRules = (input: string): Rule[] =>
  input.split("\n").map((line) => {
    const [before, after] = line.split("|");
    return { before: +before, after: +after };
  });

const pageNumberCannotBeAfter = (pageNumber: number, rules: Rule[]): number[] =>
  rules.filter((rule) => rule.before === pageNumber).map((r) => r.after);

const getApplicableRulesForUpdate = (
  rules: Rule[],
  numbers: number[],
): Rule[] =>
  rules.filter(
    (rule) => numbers.includes(rule.before) && numbers.includes(rule.after),
  );

const filterUpdates = (
  updates: number[][],
  rules: Rule[],
  valid: boolean,
): number[][] =>
  updates.filter((update) => {
    const pageNumbersSeen = new Set<number>();

    for (let i = 0; i < update.length; i++) {
      const pageNumber = update[i];
      const cannotBeAfter = pageNumberCannotBeAfter(pageNumber, rules);
      if ([...pageNumbersSeen].some((num) => cannotBeAfter.includes(num))) {
        return !valid;
      }
      pageNumbersSeen.add(pageNumber);
    }

    return valid;
  });

const parseUpdatesAndRules = (input: string) => {
  const [rulesInput, updatesInput] = input.split("\n\n");
  const rules = parseRules(rulesInput);
  const updates = updatesInput
    .split("\n")
    .map((update) => update.split(",").map((n) => +n));
  return { updates, rules };
};

const getMiddleNumber = (input: number[]): number =>
  input[Math.round(input.length / 2) - 1];

const fixInvalidUpdates = (updates: number[][], rules: Rule[]): number[][] =>
  updates.map((update) => {
    let applicableRules = getApplicableRulesForUpdate(rules, update);
    const fixed: number[] = [];

    while (fixed.length < update.length) {
      const number = update.find(
        (number) =>
          !fixed.includes(number) &&
          applicableRules.every(({ after }) => after !== number),
      );
      fixed.push(number!);
      applicableRules = applicableRules.filter(
        ({ before }) => before !== number,
      );
    }

    return fixed;
  });

/**
 * Examples
 */

const example1in = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

function example1() {
  // 143
  console.log(example1in);
  console.log();

  const { updates, rules } = parseUpdatesAndRules(example1in);
  const validUpdates = filterUpdates(updates, rules, true);
  console.log(
    validUpdates.reduce((acc, update) => (acc += getMiddleNumber(update)), 0),
  );
}

function example2() {
  // 123
  console.log(example1in);
  console.log();

  const { updates, rules } = parseUpdatesAndRules(example1in);
  const invalidUpdates = filterUpdates(updates, rules, false);
  const fixed = fixInvalidUpdates(invalidUpdates, rules);
  console.log(
    fixed.reduce((acc, update) => (acc += getMiddleNumber(update)), 0),
  );
}

/**
 * Answers
 */

function part1() {
  // 6505
  const { updates, rules } = parseUpdatesAndRules(getInputString(5));
  const validUpdates = filterUpdates(updates, rules, true);
  console.log(
    validUpdates.reduce((acc, update) => (acc += getMiddleNumber(update)), 0),
  );
}

function part2() {
  const { updates, rules } = parseUpdatesAndRules(getInputString(5));
  const invalidUpdates = filterUpdates(updates, rules, false);
  const fixed = fixInvalidUpdates(invalidUpdates, rules);
  console.log(
    fixed.reduce((acc, update) => (acc += getMiddleNumber(update)), 0),
  );
}

part2();
