import { createReadStream } from "fs";
import { createInterface } from "readline";

export function getInputLineIteratorForDay(day: number) {
  const readStream = createReadStream(`day/${day}/input.txt`, {
    encoding: "utf-8",
  });
  return createInterface(readStream);
}
