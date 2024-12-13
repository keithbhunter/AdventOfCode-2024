export type Size = { width: number; height: number };

export const sizeOf = <T>(arrayOfArrays: T[][]): Size => {
  if (arrayOfArrays.length <= 0) {
    return { width: 0, height: 0 };
  }
  if (!arrayOfArrays.every((arr) => arr.length === arrayOfArrays[0].length)) {
    throw new Error("arrays must all have same length to determine size");
  }
  return { width: arrayOfArrays[0].length, height: arrayOfArrays.length };
};
