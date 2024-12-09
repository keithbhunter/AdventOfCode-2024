export enum Direction {
  up = "up",
  down = "down",
  left = "left",
  right = "right",
}

export function turnRight(direction: Direction) {
  switch (direction) {
    case Direction.up:
      return Direction.right;
    case Direction.left:
      return Direction.up;
    case Direction.right:
      return Direction.down;
    case Direction.down:
      return Direction.left;
  }
}
