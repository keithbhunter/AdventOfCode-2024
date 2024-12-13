import { Direction } from "./direction";
import { sizeOf } from "./size";

export type Coordinate = { row: number; col: number };

export const slope = (
  a: Coordinate,
  b: Coordinate,
): [deltaY: number, deltaX: number] => [b.row - a.row, b.col - a.col];

export const nextPosition = (
  position: Coordinate,
  direction: Direction,
): Coordinate => {
  switch (direction) {
    case Direction.up:
      return { row: position.row - 1, col: position.col };
    case Direction.down:
      return { row: position.row + 1, col: position.col };
    case Direction.left:
      return { row: position.row, col: position.col - 1 };
    case Direction.right:
      return { row: position.row, col: position.col + 1 };
  }
};

export const isInMap = <T>(coordinate: Coordinate, map: T[][]): boolean => {
  const size = sizeOf(map);
  return (
    coordinate.row >= 0 &&
    coordinate.row < size.height &&
    coordinate.col >= 0 &&
    coordinate.col < size.width
  );
};

export const valueAtCoordinate = <T>(coordinate: Coordinate, map: T[][]): T =>
  map[coordinate.row][coordinate.col];
