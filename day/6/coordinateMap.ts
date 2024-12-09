export type Coordinate = { row: number; col: number };

// This is basically Map<Coordinate, V>
export default class CoordinateMap<V> extends Map<Coordinate, V> {
  private _key(coordinate: Coordinate): Coordinate {
    // @ts-ignore
    return `${coordinate.row},${coordinate.col}`;
  }

  private _coordinate(key: string): Coordinate {
    const [row, col] = key.split(",");
    return { row: +row, col: +col };
  }

  get(coordinate: Coordinate): V | undefined {
    return super.get(this._key(coordinate));
  }

  set(coordinate: Coordinate, value: V): this {
    return super.set(this._key(coordinate), value);
  }

  delete(coordinate: Coordinate): boolean {
    return super.delete(this._key(coordinate));
  }

  forEach(
    callbackfn: (value: V, key: Coordinate, map: Map<Coordinate, V>) => void,
    thisArg?: any,
  ): void {
    return super.forEach((v, key) =>
      // @ts-ignore
      callbackfn(v, this._coordinate(key), this),
    );
  }

  has(coordinate: Coordinate): boolean {
    return super.has(this._key(coordinate));
  }
}
