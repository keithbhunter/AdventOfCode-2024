import { getInputString } from "../../utils";
import CoordinateMap, { Coordinate } from "./coordinateMap";
import { Direction, turnRight } from "./direction";

// Placeholders to help identify things on the map.
class Obstruction {}
class OpenSpace {}

class OutOfBoundsError extends Error {}

type MapItem = Obstruction | Guard | OpenSpace;

class Guard {
  private _facing: Direction;
  private _position: Coordinate;

  // Basically Set<Coordinate> since I'm not using the value.
  private _visited = new CoordinateMap<boolean>();

  constructor(
    readonly map: CoordinateMap<MapItem>,
    initialPosition: Coordinate,
    facing: Direction,
  ) {
    this._position = initialPosition;
    this._visited.set(initialPosition, true);
    this._facing = facing;
  }

  get visited() {
    return this._visited;
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

    this.map.set(this._position, new OpenSpace());
    this._position = nextPosition;
    this.map.set(this._position, this);
    this._visited.set(this._position, true);
  }

  private _turnRight() {
    this._facing = turnRight(this._facing);
  }

  private _getNextPosition(): Coordinate {
    switch (this._facing) {
      case Direction.up:
        return { row: this._position.row - 1, col: this._position.col };
      case Direction.left:
        return { row: this._position.row, col: this._position.col - 1 };
      case Direction.right:
        return { row: this._position.row, col: this._position.col + 1 };
      case Direction.down:
        return { row: this._position.row + 1, col: this._position.col };
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

enum State {
  start,
  end,
}

class StateMachine {
  private _state = State.start;
  private _guard: Guard;

  constructor(readonly map: CoordinateMap<MapItem>) {
    this._guard = [...this.map.values()].find(
      (value) => value instanceof Guard,
    )!;
  }

  get guard() {
    return this._guard;
  }

  start() {
    while (this._state !== State.end) {
      try {
        this.guard.move();
      } catch (e) {
        if (e instanceof OutOfBoundsError) {
          this._state = State.end;
        } else {
          throw e;
        }
      }
    }
  }
}

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

const example1 = () => {
  console.log(example1in);
  console.log();
  const map = generateMap(example1in);
  const sm = new StateMachine(map);
  sm.start();
  console.log(sm.guard.visited);
};

/**
 * Answers
 */

const part1 = () => {
  const map = generateMap(getInputString(6));
  const sm = new StateMachine(map);
  sm.start();
  console.log(sm.guard.visited.size);
};

part1();
