import { getInputString } from "../../utils";

type WordSearch = string[][];

function createWordSearch(input: string): WordSearch {
  const lines = input.split("\n");
  if (!lines.every((line) => line.length === lines[0].length)) {
    throw new Error("each line must have same num of letters");
  }
  return lines.map((l) => l.split(""));
}

type WordSearchLocation = [row: number, col: number];

function flip(
  wordLocation: WordSearchLocation[],
  direction: Direction,
): WordSearchLocation[] {
  if (wordLocation.length % 2 === 0) {
    throw new Error("must be odd number to flip");
  }
  return wordLocation.map(([row, col], index) => {
    const [inverseRow, inverseCol] =
      wordLocation[wordLocation.length - index - 1];
    switch (direction) {
      case Direction.left:
      case Direction.right:
        return [row, inverseCol];
      case Direction.up:
      case Direction.down:
        return [inverseRow, col];
      default:
        throw new Error("cannot flip diagonally");
    }
  });
}

function isDiagonal(location: WordSearchLocation[]): boolean {
  const [startRow, startCol] = location[0];
  const [nextRow, nextCol] = location[1];
  return startRow !== nextRow && startCol !== nextCol;
}

function isSameLocation(
  a: WordSearchLocation[],
  b: WordSearchLocation[],
): boolean {
  return a.every(
    ([row, col], index) => b[index][0] === row && b[index][1] === col,
  );
}

enum Direction {
  right = "right",
  left = "left",
  up = "up",
  down = "down",
  diagonalUpLeft = "diagonalUpLeft",
  diagonalDownLeft = "diagonalDownLeft",
  diagonalUpRight = "diagonalUpRight",
  diagonalDownRight = "diagonalDownRight",
}

class WordSearcher {
  constructor(readonly wordSearch: WordSearch) {}

  get numOfLines(): number {
    return this.wordSearch.length;
  }
  get numOfColumns(): number {
    return this.wordSearch[0].length;
  }

  lineAt(row: number): string[] {
    return this.wordSearch[row];
  }

  letterAt([row, col]: WordSearchLocation): string {
    return this.wordSearch[row][col];
  }

  findMatchAt(
    word: string,
    [startRow, startCol]: WordSearchLocation,
    direction: Direction,
  ): WordSearchLocation[] | null {
    let matchIndex = 0;
    let row = startRow;
    let col = startCol;
    let locations: WordSearchLocation[] = [];

    do {
      let letterToMatch = word.charAt(matchIndex);
      if (this.letterAt([row, col]) === letterToMatch) {
        locations.push([row, col]);
      } else {
        return null;
      }

      matchIndex++;
      if (matchIndex === word.length) {
        return locations;
      }

      switch (direction) {
        case Direction.left:
          col--;
          break;
        case Direction.right:
          col++;
          break;
        case Direction.up:
          row--;
          break;
        case Direction.down:
          row++;
          break;
        case Direction.diagonalUpLeft:
          row--;
          col--;
          break;
        case Direction.diagonalUpRight:
          row++;
          col--;
          break;
        case Direction.diagonalDownLeft:
          row--;
          col++;
          break;
        case Direction.diagonalDownRight:
          row++;
          col++;
          break;
      }
    } while (
      row >= 0 &&
      row < this.numOfLines &&
      col >= 0 &&
      col < this.numOfColumns
    );

    return null;
  }

  findMatches(word: string): WordSearchLocation[][] | null {
    let allMatches: WordSearchLocation[][] = [];
    for (let line = 0; line < this.numOfLines; line++) {
      for (let col = 0; col < this.numOfColumns; col++) {
        if (this.letterAt([line, col]) === word.charAt(0)) {
          const matches = Object.values(Direction)
            .map((dir) => this.findMatchAt(word, [line, col], dir))
            .filter((m): m is WordSearchLocation[] => !!m);
          allMatches = allMatches.concat(matches);
        }
      }
    }
    return allMatches;
  }

  matchXForm(wordMatch: WordSearchLocation[]): WordSearchLocation[] | null {
    for (const dir of [
      Direction.up,
      Direction.down,
      Direction.left,
      Direction.right,
    ]) {
      const flippedLocation = flip(wordMatch, dir);
      if (
        flippedLocation.every(
          (location, i) =>
            this.letterAt(wordMatch[i]) === this.letterAt(location),
        )
      ) {
        return flippedLocation;
      }
    }
    return null;
  }

  numberOfXForms(word: string): number {
    const matchLocations = this.findMatches(word);
    if (!matchLocations) {
      return 0;
    }

    let xMatchLocations: WordSearchLocation[][] = [];

    for (const matchLocation of matchLocations) {
      if (!isDiagonal(matchLocation)) {
        continue;
      }
      if (xMatchLocations.find((loc) => isSameLocation(loc, matchLocation))) {
        continue;
      }

      const xFormLocation = this.matchXForm(matchLocation);
      if (xFormLocation) {
        xMatchLocations.push(xFormLocation);
      }
    }
    return xMatchLocations.length;
  }
}

/**
 * Examples
 */

const exampleInput = `..X...
.SAMX.
.A..A.
XMAS.S
.X....`;

const exampleIn1 = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

function example1() {
  const wordSearcher = new WordSearcher(createWordSearch(exampleIn1));
  console.log(wordSearcher.findMatches("XMAS")?.length ?? 0);
}

function example2() {
  const wordSearcher = new WordSearcher(createWordSearch(exampleIn1));
  console.log(wordSearcher.numberOfXForms("MAS"));
}

/**
 * Answers
 */

function part1() {
  const input = getInputString(4).trim();
  const searcher = new WordSearcher(createWordSearch(input));
  console.log(searcher.findMatches("XMAS")?.length ?? 0);
}

function part2() {
  const input = getInputString(4).trim();
  const searcher = new WordSearcher(createWordSearch(input));
  console.log(searcher.numberOfXForms("MAS"));
}

part2();
