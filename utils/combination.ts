// combinations([a,b,c], 2) => [[a,b], [a,c], [b,c]]
export const combinations = <T>(arr: T[], r: number): T[][] => {
  if (r === 0) {
    return [[]];
  }

  const result: T[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    const rest = arr.slice(i + 1);
    const perms = combinations(rest, r - 1);

    for (const perm of perms) {
      result.push([el, ...perm]);
    }
  }

  return result;
};
