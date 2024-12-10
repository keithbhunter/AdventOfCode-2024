export type Coordinate = { row: number; col: number };

export function isEqualCoordinates(a: Coordinate, b: Coordinate): boolean {
  return a.row === b.row && a.col === b.col;
}

const toKey = (coordinate: Coordinate): Coordinate => {
  // @ts-ignore
  return `${coordinate.row},${coordinate.col}`;
};

const toCoordinate = (key: Coordinate): Coordinate => {
  // @ts-ignore
  const keyAsString: string = key;
  const [row, col] = keyAsString.split(",");
  return { row: +row, col: +col };
};

// This is basically Map<Coordinate, V>
export default class CoordinateMap<V> extends Map<Coordinate, V> {
  get(coordinate: Coordinate): V | undefined {
    return super.get(toKey(coordinate));
  }

  set(coordinate: Coordinate, value: V): this {
    return super.set(toKey(coordinate), value);
  }

  delete(coordinate: Coordinate): boolean {
    return super.delete(toKey(coordinate));
  }

  forEach(
    callbackfn: (value: V, key: Coordinate, map: Map<Coordinate, V>) => void,
    thisArg?: any,
  ): void {
    return super.forEach((v, key) => callbackfn(v, toCoordinate(key), this));
  }

  has(coordinate: Coordinate): boolean {
    return super.has(toKey(coordinate));
  }

  *keys(): MapIterator<Coordinate> {
    const parentKeyIterator = super.keys();
    for (const key of parentKeyIterator) {
      yield toCoordinate(key);
    }
  }
}
