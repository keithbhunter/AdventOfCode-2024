export type Coordinate = { row: number; col: number };

export const slope = (
  a: Coordinate,
  b: Coordinate,
): [deltaY: number, deltaX: number] => [b.row - a.row, b.col - a.col];
