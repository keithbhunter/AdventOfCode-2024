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

const parseUpdate = (input: string): number[] =>
  input.split(",").map((n) => +n);

const parseAllUpdates = (input: string): number[][] =>
  input.split("\n").map((update) => parseUpdate(update));

const filterValidUpdates = (updates: number[][], rules: Rule[]): number[][] =>
  updates.filter((update) => {
    const pageNumbersSeen = new Set<number>();

    for (let i = 0; i < update.length; i++) {
      const pageNumber = update[i];
      const cannotBeAfter = pageNumberCannotBeAfter(pageNumber, rules);
      if ([...pageNumbersSeen].some((num) => cannotBeAfter.includes(num))) {
        return false;
      }
      pageNumbersSeen.add(pageNumber);
    }

    return true;
  });

const parseValidRules = (input: string): number[][] => {
  const [rulesInput, updatesInput] = input.split("\n\n");
  const rules = parseRules(rulesInput);
  const updates = parseAllUpdates(updatesInput);
  return filterValidUpdates(updates, rules);
};

const getMiddleNumber = (input: number[]): number =>
  input[Math.round(input.length / 2) - 1];

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

  const validUpdates = parseValidRules(example1in);
  console.log(
    validUpdates.reduce((acc, update) => (acc += getMiddleNumber(update)), 0),
  );
}

/**
 * Answers
 */

function part1() {
  // 6505
  const validUpdates = parseValidRules(getInputString(5));
  console.log(
    validUpdates.reduce((acc, update) => (acc += getMiddleNumber(update)), 0),
  );
}

part1();
