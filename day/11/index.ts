import { getInputString } from "../../utils";
import ArrayTree from "../../utils/arrayTree";

const trimLeadingZeroes = (str: string) => (+str).toString();

/*
125 17
253000 1 7
253 0 2024 14168
512072 1 20 24 28676032
512 72 2024 2 0 2 4 2867 6032
1036288 7 2 20 24 4048 1 4048 8096 28 67 60 32
2097446912 14168 4048 2 0 2 4 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2
*/
const blink = (times: number, input: string[]) => {
  const tree = new ArrayTree(input);

  for (let i = 0; i < times; i++) {
    // console.log("blink", i, [...tree.preOrderTraversal()]);
    console.log("blink", i);
    let index = 0;
    do {
      const digits = tree.at(index);
      // console.log('digits', digits)
      if (!digits) {
        throw new Error(`unexpected error; could not get index ${index}`);
      }
      if (digits === "0") {
        tree.replace(index, "1");
        continue;
      }

      if (digits.length % 2 === 0) {
        const halfDigitIndex = digits.length / 2;
        const firstHalf = digits.substring(0, halfDigitIndex);
        const secondHalf = digits.substring(halfDigitIndex);
        tree.replace(index, [
          trimLeadingZeroes(firstHalf),
          trimLeadingZeroes(secondHalf),
        ]);
        index++;
        continue;
      }

      tree.replace(index, (+digits * 2024).toString());
    } while (++index < tree.length);
  }
  return [...tree.preOrderTraversal()];
};

/**
 * Examples
 */

const exampleIn = `125 17`;

const example1 = () => {
  console.log(blink(6, exampleIn.trim().split(" ")));
};

/**
 * Answers
 */

const part1 = () => {
  console.log(blink(75, getInputString(11).trim().split(" ")).length);
};

part1();

// const t = new ArrayTree(["125", "17"]);
// t.replace(0, "253000");
// t.replace(1, ["1", "7"]);
// t.replace(0, ["253", "0"]);
// console.log(t.at(0));
// console.log('finding')
// console.log(t.at(0));
// console.log(t.at(1));
// console.log(t.at(2));
// console.log(t.length);
