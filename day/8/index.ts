import { Coordinate, slope } from "../../utils/coordinate";
import { combinations } from "../../utils/combination";
import { getInputString } from "../../utils";
import CoordinateMap from "../6/coordinateMap";

const createMap = (input: string): string[][] =>
  input.split("\n").map((line) => [...line]);

const coordinateIsInMap = (coordinate: Coordinate, map: string[][]): boolean =>
  coordinate.row >= 0 &&
  coordinate.row < map.length &&
  coordinate.col >= 0 &&
  coordinate.col < map[0].length;

const findAntennaLocations = (
  map: string[][],
): Record<string, Coordinate[]> => {
  const locations: Record<string, Coordinate[]> = {};
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map.length; col++) {
      const char = map[row][col];
      if (char !== ".") {
        locations[char] ??= [];
        locations[char].push({ row, col });
      }
    }
  }
  return locations;
};

const calculateAntinodeLocations = (
  map: string[][],
  antennaLocations: Record<string, Coordinate[]>,
): Record<string, Coordinate[]> => {
  const antinodes: Record<string, Coordinate[]> = {};
  for (const frequency in antennaLocations) {
    antinodes[frequency] ??= [];

    for (const locationPair of combinations(antennaLocations[frequency], 2)) {
      const [deltaY, deltaX] = slope(locationPair[0], locationPair[1]);
      antinodes[frequency] = antinodes[frequency].concat(
        [
          {
            row: locationPair[0].row - deltaY,
            col: locationPair[0].col - deltaX,
          },
          {
            row: locationPair[1].row + deltaY,
            col: locationPair[1].col + deltaX,
          },
        ].filter((coordinate) => coordinateIsInMap(coordinate, map)),
      );
    }
  }
  return antinodes;
};

const uniqueAntinodeLocations = (
  locations: Record<string, Coordinate[]>,
): CoordinateMap<number> => {
  const map = new CoordinateMap<number>();
  for (const frequency in locations) {
    for (const location of locations[frequency]) {
      map.set(location, (map.get(location) ?? 0) + 1);
    }
  }
  return map;
};

/**
 * Examples
 */

const exampleIn = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

// 14
const example1 = () => {
  console.log(`${exampleIn}\n`);
  const map = createMap(exampleIn);
  const locations = findAntennaLocations(map);
  const antinodeLocations = uniqueAntinodeLocations(
    calculateAntinodeLocations(map, locations),
  );
  console.log(antinodeLocations);
};

/**
 * Answers
 */

// 220
const part1 = () => {
  const map = createMap(getInputString(8).trim());
  const locations = findAntennaLocations(map);
  const antinodeLocations = uniqueAntinodeLocations(
    calculateAntinodeLocations(map, locations),
  );
  console.log(antinodeLocations.size);
};

part1();
