import { getInputString } from "../../utils";

const getDiskLayout = (diskMap: string): Array<number | null> => {
  const layout: Array<number | null> = [];
  const diskMapChars = [...diskMap.trim()];
  let fileIndex = 0;

  for (let i = 0; i < diskMapChars.length; i++) {
    const isFreeSpace = i % 2;
    layout.push(
      ...Array(+diskMapChars[i]).fill(isFreeSpace ? null : fileIndex),
    );
    isFreeSpace && fileIndex++;
  }

  return layout;
};

const rearrange = (layout: Array<number | null>): Array<number | null> => {
  let freeIndex;
  let fileIndex;

  do {
    freeIndex = layout.findIndex((block) => block === null);
    fileIndex = layout.findLastIndex((block) => block !== null);
    if (freeIndex === -1 || fileIndex === -1 || fileIndex < freeIndex) {
      break;
    }

    layout[freeIndex] = layout[fileIndex];
    layout[fileIndex] = null;
  } while (freeIndex < fileIndex);

  return layout;
};

const checksum = (layout: Array<number | null>): number =>
  layout.reduce<number>(
    (acc, block, index) => (block === null ? acc : acc + index * block),
    0,
  );

/**
 * Examples
 */

const exampleIn = `2333133121414131402`;

const example1 = () => {
  console.log(`${exampleIn}\n`);
  const layout = rearrange(getDiskLayout(exampleIn));
  console.log(checksum(layout));
};

/**
 * Answers
 */

const part1 = () => {
  const layout = rearrange(getDiskLayout(getInputString(9)));
  console.log(checksum(layout));
};

part1();
