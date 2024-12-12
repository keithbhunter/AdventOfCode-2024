import { getInputString } from "../../utils";
import { findLastRange, findRange } from "../../utils/array";

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
  let fileIndex = layout.length - 1;

  while (fileIndex > 0) {
    let currentFile: number | null = null;
    let fileRange = findLastRange(layout, fileIndex, (v, i) => {
      if (currentFile === null) {
        currentFile = v;
      }
      return v !== null && v === currentFile;
    });
    if (!fileRange) {
      return layout;
    }

    const [fileStart, fileEnd] = fileRange;
    const fileRangeLength = fileEnd - fileStart;
    let freeIndex = 0;

    while (freeIndex < fileStart) {
      let freeRange = findRange(layout, freeIndex, (v) => v === null);
      if (!freeRange) {
        break;
      }

      const [freeStart, freeEnd] = freeRange;
      const freeRangeLength = freeEnd - freeStart;

      if (freeStart < fileStart && fileRangeLength <= freeRangeLength) {
        for (let i = freeStart; i <= freeStart + fileRangeLength; i++) {
          layout[i] = layout[fileStart];
        }
        for (let i = fileStart; i <= fileEnd; i++) {
          layout[i] = null;
        }
        break;
      }

      freeIndex = freeEnd + 1;
    }
    fileIndex = fileStart - 1;
  }

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

// Example 1: 1928
// Example 2: 2858
const example1 = () => {
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
