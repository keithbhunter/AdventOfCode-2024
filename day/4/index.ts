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

  match(
    word: string,
    [startRow, startCol]: WordSearchLocation,
    direction: Direction,
  ): boolean {
    let matchIndex = 0;
    let row = startRow;
    let col = startCol;

    do {
      let letterToMatch = word.charAt(matchIndex);
      if (this.letterAt([row, col]) !== letterToMatch) {
        return false;
      }

      matchIndex++;
      if (matchIndex === word.length) {
        return true;
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

    return false;
  }

  numberOfWord(word: string): number {
    let matches = 0;
    for (let line = 0; line < this.numOfLines; line++) {
      for (let col = 0; col < this.numOfColumns; col++) {
        if (this.letterAt([line, col]) === word.charAt(0)) {
          matches += Object.values(Direction).filter((dir) =>
            this.match(word, [line, col], dir),
          ).length;
        }
      }
    }
    return matches;
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
  console.log(wordSearcher.numberOfWord("XMAS"));
}

/**
 * Answers
 */

function part1() {
  const input = getInputString(4).trim();
  const searcher = new WordSearcher(createWordSearch(input));
  console.log(searcher.numberOfWord("XMAS"));
}

part1();
