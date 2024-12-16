import { getInputString } from "../../utils";
import {
  Coordinate,
  isInMap,
  nextPosition,
  valueAtCoordinate,
} from "../../utils/coordinate";
import { Direction } from "../../utils/direction";
import Tree, { TreeNode } from "../../utils/tree";
import CoordinateMap, { isEqualCoordinates } from "../6/coordinateMap";

const parseHikingMap = (
  input: string,
): { hikingMap: number[][]; trailheads: Coordinate[] } => {
  const hikingMap: number[][] = [];
  const trailheads: Coordinate[] = [];
  const lines = input.trim().split("\n");

  for (let row = 0; row < lines.length; row++) {
    hikingMap.push([]);
    const line = lines[row];

    for (let col = 0; col < line.length; col++) {
      const char = line.charAt(col);
      hikingMap[row].push(char === "." ? 100 : +char);

      if (char === "0") {
        trailheads.push({ row, col });
      }
    }
  }

  return { hikingMap, trailheads };
};

const findNumberOfTrailsFromTrailhead = (
  hikingMap: number[][],
  trailhead: Coordinate,
): number => {
  const addNextSteps = (node: TreeNode<Coordinate>) => {
    const current = node.value;
    const previous = node.parent?.value;

    for (const direction of Object.values(Direction)) {
      const next = nextPosition(current, direction);
      if (!isInMap(next, hikingMap)) {
        continue;
      }
      if (
        valueAtCoordinate(next, hikingMap) !==
        valueAtCoordinate(current, hikingMap) + 1
      ) {
        continue;
      }
      if (previous && isEqualCoordinates(next, previous)) {
        continue;
      }
      const child = node.addChild(next);
      addNextSteps(child);
    }
  };

  const tree = new Tree(trailhead);
  addNextSteps(tree.root);

  return [...tree.preOrderTraversal()].filter(
    (node) =>
      node.children.length === 0 &&
      valueAtCoordinate(node.value, hikingMap) === 9,
  ).length;
};

/**
 * Example
 */

const simpleExample = `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`;

const simpleishExample = `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`;

const exampleIn = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

// Part 1: 36
// Part 2: 81
const example1 = () => {
  console.log(`${exampleIn}\n`);
  const { hikingMap, trailheads } = parseHikingMap(exampleIn);
  const numOfTrails = trailheads.reduce(
    (acc, trailhead) =>
      acc + findNumberOfTrailsFromTrailhead(hikingMap, trailhead),
    0,
  );
  console.log(numOfTrails);
};

/**
 * Answer
 */

const part1 = () => {
  const { hikingMap, trailheads } = parseHikingMap(getInputString(10));
  const numOfTrails = trailheads.reduce(
    (acc, trailhead) =>
      acc + findNumberOfTrailsFromTrailhead(hikingMap, trailhead),
    0,
  );
  console.log(numOfTrails);
};

part1();
