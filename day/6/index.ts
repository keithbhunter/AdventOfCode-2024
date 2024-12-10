import { getInputString } from "../../utils";
import CoordinateMap, { Coordinate, isEqualCoordinates } from "./coordinateMap";
import { Direction, turnRight } from "./direction";

// Placeholders to help identify things on the map.
class Obstruction {}
class OpenSpace {}

class OutOfBoundsError extends Error {}
class InfiniteLoopError extends Error {}

type MapItem = Obstruction | Guard | OpenSpace;

class Guard {
  facing: Direction;
  position: Coordinate;
  visited = new CoordinateMap<number>();

  constructor(
    readonly map: CoordinateMap<MapItem>,
    readonly initialPosition: Coordinate,
    readonly initialFacing: Direction,
  ) {
    this.position = initialPosition;
    this.facing = initialFacing;
    this.visited.set(initialPosition, 1);
  }

  get distanceMoved(): number {
    return [...this.visited.values()].reduce((acc, v) => acc + v, 0);
  }

  reset() {
    this.map.set(this.position, new OpenSpace());
    this.map.set(this.initialPosition, this);
    this.position = this.initialPosition;
    this.facing = this.initialFacing;
    this.visited.clear();
  }

  move() {
    let nextPosition = this._getNextPosition();

    while (this.map.get(nextPosition) instanceof Obstruction) {
      this._turnRight();
      nextPosition = this._getNextPosition();
    }

    if (!(this.map.get(nextPosition) instanceof OpenSpace)) {
      throw new OutOfBoundsError();
    }

    this.map.set(this.position, new OpenSpace());
    this.position = nextPosition;
    this.map.set(this.position, this);

    const previouslyVisited = this.visited.get(this.position) ?? 0;
    if (previouslyVisited > 10) {
      throw new InfiniteLoopError();
    }

    this.visited.set(this.position, previouslyVisited + 1);
  }

  private _turnRight() {
    this.facing = turnRight(this.facing);
  }

  private _getNextPosition(): Coordinate {
    switch (this.facing) {
      case Direction.up:
        return { row: this.position.row - 1, col: this.position.col };
      case Direction.left:
        return { row: this.position.row, col: this.position.col - 1 };
      case Direction.right:
        return { row: this.position.row, col: this.position.col + 1 };
      case Direction.down:
        return { row: this.position.row + 1, col: this.position.col };
    }
  }
}

const generateMap = (input: string): CoordinateMap<MapItem> => {
  return input.split("\n").reduce((acc, line, row) => {
    for (let col = 0; col < line.length; col++) {
      const position = { row, col };
      switch (line.charAt(col)) {
        case "#":
          acc.set(position, new Obstruction());
          break;
        case "^":
          acc.set(position, new Guard(acc, position, Direction.up));
          break;
        default:
          acc.set(position, new OpenSpace());
          break;
      }
    }
    return acc;
  }, new CoordinateMap<MapItem>());
};

const getVisitedPositions = (map: CoordinateMap<MapItem>): Coordinate[] => {
  const guard = [...map.values()].find((value) => value instanceof Guard)!;
  while (true) {
    try {
      guard.move();
    } catch (e) {
      if (e instanceof OutOfBoundsError) {
        return [...guard.visited.keys()];
      }
      throw e;
    }
  }
};

const getObstructionsForInfiniteLoop = (
  map: CoordinateMap<MapItem>,
): Coordinate[] => {
  const guard = [...map.values()].find((value) => value instanceof Guard)!;
  const initialPosition = guard.position;
  const visited = getVisitedPositions(map).filter(
    (coordinate) => !isEqualCoordinates(coordinate, initialPosition),
  );
  const locations: Coordinate[] = [];

  for (const coordinate of visited) {
    guard.reset();
    map.set(coordinate, new Obstruction());

    try {
      getVisitedPositions(map);
    } catch (e) {
      if (e instanceof InfiniteLoopError) {
        locations.push(coordinate);
        continue;
      }
      throw e;
    } finally {
      map.set(coordinate, new OpenSpace());
    }
  }

  return locations;
};

/**
 * Examples
 */

const example1in = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

// 41
const example1 = () => {
  console.log(example1in);
  console.log();
  const map = generateMap(example1in);
  console.log(getVisitedPositions(map).length);
};

// 6
const example2 = () => {
  console.log(example1in);
  console.log();
  const map = generateMap(example1in);
  const locations = getObstructionsForInfiniteLoop(map);
  console.log(locations);
  console.log(locations.length);
};

/**
 * Answers
 */

// 5080
const part1 = () => {
  const map = generateMap(getInputString(6));
  console.log(getVisitedPositions(map).length);
};

// 1919
const part2 = () => {
  const map = generateMap(getInputString(6));
  console.log(getObstructionsForInfiniteLoop(map).length);
};

part2();
