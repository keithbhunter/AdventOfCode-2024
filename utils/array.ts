type Range = [start: number, end: number];

export const findRange = <T>(
  layout: Array<T>,
  start: number,
  predicate: (value: T, index: number) => boolean,
): Range | null => {
  let rangeStart = null;
  let rangeEnd = null;
  for (let i = start; i <= layout.length; i++) {
    const matches = predicate(layout[i], i);
    if (matches && rangeStart === null) {
      rangeStart = i;
    }
    if (!matches && rangeStart !== null) {
      rangeEnd = i - 1;
      break;
    }
  }
  return rangeStart && rangeEnd ? [rangeStart, rangeEnd] : null;
};

export const findLastRange = <T>(
  layout: Array<T>,
  start = layout.length - 1,
  predicate: (value: T, index: number) => boolean,
): Range | null => {
  let rangeStart = null;
  let rangeEnd = null;
  for (let i = start; i >= 0; i--) {
    const matches = predicate(layout[i], i);
    if (matches && rangeEnd === null) {
      rangeEnd = i;
    }
    if (!matches && rangeEnd !== null) {
      rangeStart = i + 1;
      break;
    }
  }
  return rangeStart && rangeEnd ? [rangeStart, rangeEnd] : null;
};
