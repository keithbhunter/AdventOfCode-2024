import { getInputString } from "../../utils";

const trimLeadingZeroes = (str: string) => (+str).toString();

const changeStone = (stone: string): string[] => {
  if (stone === "0") {
    return ["1"];
  }

  if (stone.length % 2 === 0) {
    const halfDigitIndex = stone.length / 2;
    const firstHalf = stone.substring(0, halfDigitIndex);
    const secondHalf = stone.substring(halfDigitIndex);
    return [trimLeadingZeroes(firstHalf), trimLeadingZeroes(secondHalf)];
  }

  return [(+stone * 2024).toString()];
};

/*
0. 125 17
1. 253000 1 7
2. 253 0 2024 14168
3. 512072 1 20 24 28676032
4. 512 72 2024 2 0 2 4 2867 6032
5. 1036288 7 2 20 24 4048 1 4048 8096 28 67 60 32
6. 2097446912 14168 4048 2 0 2 4 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2
*/
const blink = (times: number, stones: string[]): number => {
  let seen: Record<string, number> = stones.reduce<Record<string, number>>(
    (acc, stone) => {
      acc[stone] = (acc[stone] ?? 0) + 1;
      return acc;
    },
    {},
  );

  for (let i = 0; i < times; i++) {
    let newSeen: Record<string, number> = {};

    for (const stone in seen) {
      const numberOfTimesStoneAppears = seen[stone];
      changeStone(stone).forEach((newStone) => {
        newSeen[newStone] =
          (newSeen[newStone] ?? 0) + numberOfTimesStoneAppears;
      });
    }

    seen = newSeen;
  }

  return Object.values(seen).reduce((acc, value) => acc + value, 0);
};

/**
 * Examples
 */

const exampleIn = `125 17`;

const example1 = () => {
  // 0: 2
  // 1: 3
  // 2: 4
  // 3: 5
  // 4: 9
  // 5: 13
  // 6: 22
  // 25: 55312
  console.log(blink(25, exampleIn.trim().split(" ")));
};

/**
 * Answers
 */

const part1 = () => {
  // 25: 217812
  console.log(blink(75, getInputString(11).trim().split(" ")));
};

part1();
