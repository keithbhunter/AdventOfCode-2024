import { getInputString } from "../../utils";
import { Coordinate, isInMap, valueAtCoordinate } from "../../utils/coordinate";
import CoordinateMap from "../6/coordinateMap";

const calculateAreaAndPerimeter = (input: string) => {
  const map = input
    .trim()
    .split("\n")
    .map((line) => [...line]);
  const regions: CoordinateMap<number>[] = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (regions.some((region) => region.has({ row, col }))) {
        continue;
      }
      regions.push(calculateAreaAndPerimeterForRegion({ row, col }, map));
    }
  }

  return regions.reduce((sum, region) => {
    const area = region.size;
    const perimeter = [...region.values()].reduce(
      (sum, value) => sum + value,
      0,
    );
    return sum + area * perimeter;
  }, 0);
};

const calculateAreaAndPerimeterForRegion = (
  coordinate: Coordinate,
  map: string[][],
) => {
  const region = new CoordinateMap<number>();

  const followMatchingNeighbors = (coordinate: Coordinate) => {
    const { matching, different } = splitNeighbors(coordinate, map);
    region.set(coordinate, different.length);

    for (const neighbor of matching) {
      if (!region.has(neighbor)) {
        followMatchingNeighbors(neighbor);
      }
    }
  };

  followMatchingNeighbors(coordinate);
  return region;
};

const splitNeighbors = (coordinate: Coordinate, map: string[][]) => {
  const matching: Coordinate[] = [];
  const different: Coordinate[] = [];
  for (const neighbor of getNeighbors(coordinate)) {
    if (
      isInMap(neighbor, map) &&
      valueAtCoordinate(neighbor, map) === valueAtCoordinate(coordinate, map)
    ) {
      matching.push(neighbor);
    } else {
      different.push(neighbor);
    }
  }
  return { matching, different };
};

const getNeighbors = (coordinate: Coordinate): Coordinate[] => {
  return [
    { row: coordinate.row, col: coordinate.col - 1 },
    { row: coordinate.row, col: coordinate.col + 1 },
    { row: coordinate.row - 1, col: coordinate.col },
    { row: coordinate.row + 1, col: coordinate.col },
  ];
};

/**
 * Examples
 */

const example1a = `AAAA
BBCD
BBCC
EEEC`;

const example1b = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;

const example1c = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

const example = () => {
  console.log(`${example1c}\n`);
  console.log(calculateAreaAndPerimeter(example1c));
};

/**
 * Answers
 */

const part1 = () => {
  console.log(calculateAreaAndPerimeter(getInputString(12)));
};

part1();
