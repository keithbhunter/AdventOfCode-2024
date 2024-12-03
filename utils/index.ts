import { createReadStream, readFileSync } from "fs";
import { createInterface } from "readline";

const getInputPath = (day: number) => `day/${day}/input.txt`;

export function getInputLineIteratorForDay(day: number) {
  const readStream = createReadStream(getInputPath(day), {
    encoding: "utf-8",
  });
  return createInterface(readStream);
}

export function getInputString(day: number) {
  return readFileSync(getInputPath(day), { encoding: "utf-8" });
}
