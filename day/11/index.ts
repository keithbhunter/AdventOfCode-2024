import { getInputString } from "../../utils";

const trimLeadingZeroes = (str: string) => (+str).toString();

const blink = (times: number, input: string[]) => {
  for (let i = 0; i < times; i++) {
    let index = 0;
    do {
      const digits = input[index];
      if (digits === "0") {
        input[index] = "1";
        continue;
      }

      if (digits.length % 2 === 0) {
        const halfDigitIndex = digits.length / 2;
        const firstHalf = digits.substring(0, halfDigitIndex);
        const secondHalf = digits.substring(halfDigitIndex);

        input.splice(
          index,
          1,
          trimLeadingZeroes(firstHalf),
          trimLeadingZeroes(secondHalf),
        );
        index++;
        continue;
      }

      input[index] = (+digits * 2024).toString();
    } while (++index < input.length);
  }
  return input;
};

/**
 * Examples
 */

const exampleIn = `125 17`;

const example1 = () => {
  console.log(blink(25, exampleIn.trim().split(" ")).length);
};

/**
 * Answers
 */

const part1 = () => {
  console.log(blink(25, getInputString(11).trim().split(" ")).length);
};

part1();
